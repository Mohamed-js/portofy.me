import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    await dbConnect();
    const event = await request.json();

    console.log("Webhook received:", JSON.stringify(event, null, 2));

    if (event.type !== "TRANSACTION" || !event.obj.success) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const { order, amount_cents } = event.obj;
    const merchantOrderId = order.merchant_order_id; // e.g., "user123_monthly_1677654321"
    if (!merchantOrderId) {
      console.error("No merchant_order_id in webhook");
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const [userId, billingPeriod] = merchantOrderId.split("_").slice(0, 2); // Take first two parts
    const user = await User.findById(userId);

    if (!user) {
      console.error("User not found for webhook:", userId);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!["monthly", "annual"].includes(billingPeriod)) {
      console.error("Invalid billing period in webhook:", billingPeriod);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const subscriptionEnd = new Date();
    subscriptionEnd.setMonth(
      subscriptionEnd.getMonth() + (billingPeriod === "monthly" ? 1 : 12)
    );

    user.plan = "pro";
    user.billingPeriod = billingPeriod;
    user.subscriptionEnd = subscriptionEnd;
    user.paymobOrderId = order.id;
    await user.save();

    console.log(`User ${userId} upgraded to Pro (${billingPeriod})`);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, message: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
