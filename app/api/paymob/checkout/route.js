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
  if (!response.ok) throw new Error("Failed to get Paymob token");
  return data.token;
}

async function getExchangeRate() {
  const response = await fetch(
    `${EXCHANGE_RATE_API}/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`
  );
  const data = await response.json();
  if (data.result !== "success")
    throw new Error("Failed to fetch exchange rate");
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

    const { billingPeriod, paymentMethod } = await request.json();
    if (
      !["monthly", "annual"].includes(billingPeriod) ||
      !["card", "wallet"].includes(paymentMethod)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid billing period or payment method" },
        { status: 400 }
      );
    }

    const exchangeRate = await getExchangeRate();
    const baseAmountUSD = billingPeriod === "monthly" ? 8 : 80;
    const amountEGP = Math.round(baseAmountUSD * exchangeRate);
    const amountCents = amountEGP * 100;

    const token = await getPaymobToken();

    const orderResponse = await fetch(`${PAYMOB_API_BASE}/ecommerce/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        merchant_id: process.env.PAYMOB_MERCHANT_ID,
        amount_cents: amountCents,
        currency: "EGP",
        items: [
          {
            name: `Pro ${billingPeriod} Plan`,
            amount_cents: amountCents,
            quantity: 1,
          },
        ],
        merchant_order_id: `${userId}_${billingPeriod}`, // Pass userId and billingPeriod
      }),
    });
    const orderData = await orderResponse.json();
    if (!orderResponse.ok) throw new Error("Failed to create order");
    const orderId = orderData.id;

    const integrationId =
      paymentMethod === "card"
        ? process.env.PAYMOB_INTEGRATION_ID_CARD
        : process.env.PAYMOB_INTEGRATION_ID_WALLET;

    const paymentKeyResponse = await fetch(
      `${PAYMOB_API_BASE}/acceptance/payment_keys`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          integration_id: integrationId,
          order_id: orderId,
          billing_data: {
            email: user.email || "test@example.com",
            first_name: user.name?.split(" ")[0] || "Test",
            last_name: user.name?.split(" ")[1] || "User",
            phone_number: user.phone || "+201234567890",
            country: "EG",
          },
          amount_cents: amountCents,
          currency: "EGP",
        }),
      }
    );
    const paymentData = await paymentKeyResponse.json();
    if (!paymentKeyResponse.ok) throw new Error("Failed to get payment key");
    const paymentKey = paymentData.token;

    return NextResponse.json({ success: true, paymentKey, orderId, amountEGP });
  } catch (error) {
    console.error("Paymob checkout error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create payment" },
      { status: 500 }
    );
  }
}
