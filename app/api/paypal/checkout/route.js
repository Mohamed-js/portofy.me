import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";

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

async function createPayPalProduct(token) {
  const product = {
    name: "Pro Subscription Product",
    description: "Product for Pro subscription plans",
    type: "SERVICE",
    category: "SOFTWARE",
  };

  const response = await fetch(`${PAYPAL_API_BASE}/v1/catalogs/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("PayPal product creation error:", errorData);
    throw new Error("Failed to create PayPal product");
  }

  const productData = await response.json();
  console.log("Product created:", productData);
  return productData.id; // Returns the product_id (e.g., "PROD-XXXXXX")
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

    // Create or reuse a product
    const productId = await createPayPalProduct(token);

    // Create the subscription plan with the product_id
    const plan = {
      product_id: productId, // Add the product_id here
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
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: billingPeriod === "monthly" ? "8.00" : "80.00",
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

    const planResponse = await fetch(`${PAYPAL_API_BASE}/v1/billing/plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(plan),
    });

    if (!planResponse.ok) {
      const errorData = await planResponse.json();
      console.error("PayPal plan creation error:", errorData);
      throw new Error("Failed to create PayPal plan");
    }

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
