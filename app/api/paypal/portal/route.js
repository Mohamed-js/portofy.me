import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";

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
    if (!user || user.plan !== "pro" || !user.paypalSubscriptionId) {
      return NextResponse.json(
        { success: false, message: "No active subscription" },
        { status: 404 }
      );
    }

    // Redirect to PayPal's subscription management page (no API session like Stripe)
    const manageUrl = `https://www.paypal.com/myaccount/autopay/`; // General link; user logs in to manage
    return NextResponse.json({ success: true, url: manageUrl });
  } catch (error) {
    console.error("PayPal portal error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to redirect to portal" },
      { status: 500 }
    );
  }
}
