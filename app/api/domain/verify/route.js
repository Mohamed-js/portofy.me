// app/api/domain/verify/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import dns from "dns"; // Node.js DNS module
import { promisify } from "util";

const resolveTxt = promisify(dns.resolveTxt);

export async function POST(req) {
  try {
    await dbConnect();
    const { domain } = await req.json();
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

    const effectivePlan =
      user.plan === "pro" &&
      user.subscriptionEnd &&
      new Date(user.subscriptionEnd) > new Date()
        ? "pro"
        : "free";

    if (effectivePlan !== "pro") {
      return NextResponse.json(
        {
          success: false,
          message: "Custom domains require an active Pro subscription",
        },
        { status: 403 }
      );
    }

    // Set the custom domain
    user.customDomain = domain;
    user.domainVerified = false; // Reset until verified
    await user.save();

    // Generate a unique TXT record value for verification
    const txtValue = `portofy-verification-${userId}`;
    const instructions = {
      type: "TXT",
      host: `_verify.${domain}`,
      value: txtValue,
      message: `Add a TXT record to ${domain} with host "_verify.${domain}" and value "${txtValue}"`,
    };

    // Check DNS (async, we'll poll later)
    try {
      const records = await resolveTxt(`_verify.${domain}`);
      const isVerified = records.some((record) => record.includes(txtValue));
      if (isVerified) {
        user.domainVerified = true;
        await user.save();
        return NextResponse.json({ success: true, verified: true });
      }
    } catch (error) {
      console.log("DNS check failed, user must add TXT record:", error.message);
    }

    return NextResponse.json({
      success: true,
      verified: false,
      instructions,
    });
  } catch (error) {
    console.error("Domain verification error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
