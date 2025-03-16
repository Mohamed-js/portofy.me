import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";

// PayPal API credentials (add to .env)
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com"; // Use "api-m.paypal.com" for live

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
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const { billingPeriod } = await request.json();
    if (!["monthly", "annual"].includes(billingPeriod)) {
      return NextResponse.json(
        { success: false, message: "Invalid billing period" },
        { status: 400 }
      );
    }

    const token = await getPayPalToken();

    const plan = {
      name: `Pro ${billingPeriod} Plan`,
      description: `Pro subscription (${billingPeriod})`,
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: {
            interval_unit: billingPeriod === "monthly" ? "MONTH" : "YEAR",
            interval_count: 1,
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0, // Infinite billing
          pricing_scheme: {
            fixed_price: {
              value: billingPeriod === "monthly" ? "8.00" : "80.00", // Adjust prices
              currency_code: "USD",
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: { value: "0.00", currency_code: "USD" },
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
      },
    };

    // Create the plan
    const planResponse = await fetch(`${PAYPAL_API_BASE}/v1/billing/plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(plan),
    });
    const planData = await planResponse.json();
    const planId = planData.id;

    return NextResponse.json({ success: true, planId });
  } catch (error) {
    console.error("PayPal checkout error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create plan" },
      { status: 500 }
    );
  }
}
