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

    const priceId =
      billingPeriod === "monthly"
        ? "price_1R0tcnClHPm4GOwcFNhDiGgz"
        : "price_1R0tdoClHPm4GOwc3853MEzR";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${request.headers.get(
        "origin"
      )}/my-account?tab=settings&success=true`,
      cancel_url: `${request.headers.get("origin")}/my-account?tab=settings`,
      metadata: { userId: user._id.toString() },
    });

    return NextResponse.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
