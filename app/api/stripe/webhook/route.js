import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/db";
import User from "@/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const sig = request.headers.get("stripe-signature");
  let event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { success: false, message: "Invalid signature" },
      { status: 400 }
    );
  }

  await dbConnect();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    );

    const billingPeriod =
      subscription.items.data[0].price.recurring.interval === "month"
        ? "monthly"
        : "annual";
    const subscriptionEnd = new Date(subscription.current_period_end * 1000);

    const user = await User.findById(userId);
    if (user) {
      user.plan = "pro";
      user.billingPeriod = billingPeriod;
      user.subscriptionEnd = subscriptionEnd;
      user.stripeCustomerId = session.customer;
      await user.save();
      console.log(`User ${userId} upgraded to Pro (${billingPeriod})`);
    }
  } else if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    const user = await User.findOne({
      stripeCustomerId: subscription.customer,
    });
    if (user) {
      user.plan = "free";
      user.billingPeriod = null;
      user.subscriptionEnd = null;
      user.theme = "minimal"; // Reset to default
      user.customDomain = ""; // Clear Pro features
      user.domainVerified = false;
      await user.save();
      console.log(`User ${user._id} downgraded to Free`);
    }
  }

  return NextResponse.json({ received: true });
}
