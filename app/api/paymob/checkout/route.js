import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";

const PAYMOB_API_BASE = "https://accept.paymob.com/api";
const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const EXCHANGE_RATE_API = "https://v6.exchangerate-api.com/v6";

async function getPaymobToken() {
  const response = await fetch(`${PAYMOB_API_BASE}/auth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      "Failed to get Paymob token: " + (data.message || "Unknown error")
    );
  return data.token;
}

async function getExchangeRate() {
  const response = await fetch(
    `${EXCHANGE_RATE_API}/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`
  );
  const data = await response.json();
  if (data.result !== "success")
    throw new Error(
      "Failed to fetch exchange rate: " + (data.error || "Unknown error")
    );
  return data.conversion_rates.EGP;
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
    console.log("Received billingPeriod:", billingPeriod);
    if (!["monthly", "annual"].includes(billingPeriod)) {
      console.error("Invalid or missing billingPeriod:", billingPeriod);
      return NextResponse.json(
        { success: false, message: "Invalid billing period" },
        { status: 400 }
      );
    }

    const exchangeRate = await getExchangeRate();
    const baseAmountUSD = billingPeriod === "monthly" ? 8 : 80;
    const amountEGP = Math.round(baseAmountUSD * exchangeRate);
    const amountCents = amountEGP * 100;

    const token = await getPaymobToken();
    const uniqueId = `${userId}_${billingPeriod}_${Date.now()}`;

    const orderResponse = await fetch(`${PAYMOB_API_BASE}/ecommerce/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        auth_token: token,
        delivery_needed: false,
        amount_cents: amountCents,
        currency: "EGP",
        items: [
          {
            name: `Pro ${billingPeriod} Plan`,
            amount_cents: amountCents,
            description: `One-time purchase for ${userId}`,
            quantity: 1,
          },
        ],
        merchant_order_id: uniqueId,
      }),
    });
    const orderData = await orderResponse.json();
    if (!orderResponse.ok || orderData.message) {
      throw new Error(
        "Failed to create order: " + (orderData.message || "Unknown error")
      );
    }
    const orderId = orderData.id;

    const integrationId = process.env.PAYMOB_INTEGRATION_ID_CARD;

    const paymentKeyResponse = await fetch(
      `${PAYMOB_API_BASE}/acceptance/payment_keys`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          auth_token: token,
          amount_cents: amountCents,
          expiration: 30600,
          order_id: orderId,
          billing_data: {
            email: user.email || "test@example.com",
            first_name: user.name?.split(" ")[0] || "Test",
            last_name: user.name?.split(" ")[1] || "User",
            phone_number: user.phone || "+201234567890",
            floor: "NA",
            apartment: "NA",
            street: "NA",
            building: "NA",
            city: "NA",
            country: "EG",
          },
          currency: "EGP",
          integration_id: integrationId,
        }),
      }
    );
    const paymentData = await paymentKeyResponse.json();
    if (!paymentKeyResponse.ok) {
      throw new Error(
        "Failed to get payment key: " + (paymentData.message || "Unknown error")
      );
    }
    const paymentKey = paymentData.token;

    const iframeId = process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID;

    if (!iframeId || iframeId === "undefined") {
      throw new Error("Iframe ID is not defined in environment variables");
    }

    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`;

    return NextResponse.json({ success: true, paymentKey, orderId, iframeUrl });
  } catch (error) {
    console.error("Paymob checkout error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create payment" },
      { status: 500 }
    );
  }
}
