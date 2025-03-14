import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    if (!user || user.plan !== "pro") {
      return NextResponse.json(
        { success: false, message: "No active subscription" },
        { status: 404 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId, // Add this field to User schema
      return_url: `${request.headers.get("origin")}/my-account?tab=settings`,
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Stripe portal error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
