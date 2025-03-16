import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;
const PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com";

async function verifyWebhookSignature(event, sig, token) {
  const response = await fetch(
    `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        auth_algo: sig["auth_algo"],
        cert_url: sig["cert_url"],
        transmission_id: sig["transmission_id"],
        transmission_sig: sig["transmission_sig"],
        transmission_time: sig["transmission_time"],
        webhook_id: PAYPAL_WEBHOOK_ID,
        webhook_event: event,
      }),
    }
  );
  const result = await response.json();
  return result.verification_status === "SUCCESS";
}

async function getPayPalToken() {
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`
      ).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  return data.access_token;
}

export async function POST(request) {
  const sig = {
    auth_algo: request.headers.get("paypal-auth-algo"),
    cert_url: request.headers.get("paypal-cert-url"),
    transmission_id: request.headers.get("paypal-transmission-id"),
    transmission_sig: request.headers.get("paypal-transmission-sig"),
    transmission_time: request.headers.get("paypal-transmission-time"),
  };
  let event;

  try {
    const body = await request.text();
    const token = await getPayPalToken();
    const verified = await verifyWebhookSignature(JSON.parse(body), sig, token);
    if (!verified) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }
    event = JSON.parse(body);
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return NextResponse.json(
      { success: false, message: "Invalid signature" },
      { status: 400 }
    );
  }

  await dbConnect();

  if (event.event_type === "BILLING.SUBSCRIPTION.ACTIVATED") {
    const subscriptionId = event.resource.id;
    const subscription = await fetch(
      `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`,
      {
        headers: { Authorization: `Bearer ${await getPayPalToken()}` },
      }
    ).then((res) => res.json());

    const userId = subscription.custom_id; // Pass userId via custom_id when creating subscription
    const billingPeriod =
      subscription.billing_info.cycle_executions[0].tenure_type === "REGULAR" &&
      subscription.billing_info.cycle_executions[0].frequency.interval_unit ===
        "MONTH"
        ? "monthly"
        : "annual";
    const subscriptionEnd = new Date(
      subscription.billing_info.next_billing_time
    );

    const user = await User.findById(userId);
    if (user) {
      user.plan = "pro";
      user.billingPeriod = billingPeriod;
      user.subscriptionEnd = subscriptionEnd;
      user.paypalSubscriptionId = subscriptionId; // Add this field to User schema
      await user.save();
      console.log(`User ${userId} upgraded to Pro (${billingPeriod})`);
    }
  } else if (event.event_type === "BILLING.SUBSCRIPTION.CANCELLED") {
    const subscriptionId = event.resource.id;
    const user = await User.findOne({ paypalSubscriptionId: subscriptionId });
    if (user) {
      user.plan = "free";
      user.billingPeriod = null;
      user.subscriptionEnd = null;
      user.theme = "minimal";
      user.customDomain = "";
      user.domainVerified = false;
      await user.save();
      console.log(`User ${user._id} downgraded to Free`);
    }
  }

  return NextResponse.json({ received: true });
}
