// app/api/domain/verify/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Portfolio from "@/models/Portfolio"; // Use Portfolio instead of User
import User from "@/models/User";
import { cookies } from "next/headers";
import dns from "dns";
import { promisify } from "util";

const resolveTxt = promisify(dns.resolveTxt);

export async function POST(req) {
  try {
    await dbConnect();
    const { domain, portfolioId } = await req.json(); // Add portfolioId
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

    // Find and update the portfolio
    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      user: userId,
    });
    if (!portfolio) {
      return NextResponse.json(
        { success: false, message: "Portfolio not found" },
        { status: 404 }
      );
    }

    portfolio.customDomain = domain;
    portfolio.domainVerified = false; // Reset until verified
    await portfolio.save();

    // Generate TXT record
    const txtValue = `portofy-verification-${portfolio._id}`;
    const instructions = {
      type: "TXT",
      host: `_verify.${domain}`,
      value: txtValue,
      message: `Add a TXT record to ${domain} with host "_verify.${domain}" and value "${txtValue}"`,
    };

    // Check DNS
    try {
      const records = await resolveTxt(`_verify.${domain}`);
      const isVerified = records.some((record) => record.includes(txtValue));
      if (isVerified) {
        portfolio.domainVerified = true;
        await portfolio.save();
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
