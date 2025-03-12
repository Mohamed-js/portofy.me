import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { cookies } from "next/headers";
import dns from "dns";
import { promisify } from "util";

const resolveTxt = promisify(dns.resolveTxt);

// Vercel API config (store these in .env)
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;

export async function POST(req) {
  try {
    await dbConnect();
    const { domain, portfolioId } = await req.json();
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
    portfolio.domainVerified = false;
    await portfolio.save();

    const txtValue = `portofy-verification-${portfolio._id}`;
    const instructions = {
      type: "TXT",
      host: `_verify.${domain}`,
      value: txtValue,
      message: `Add a TXT record to ${domain} with host "_verify.${domain}" and value "${txtValue}"`,
    };

    try {
      const records = await resolveTxt(`_verify.${domain}`);
      const isVerified = records.some((record) => record.includes(txtValue));
      if (isVerified) {
        portfolio.domainVerified = true;
        await portfolio.save();

        // Add domain to Vercel
        const vercelResponse = await fetch(
          `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${VERCEL_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: domain }),
          }
        );

        const vercelData = await vercelResponse.json();
        if (!vercelResponse.ok) {
          console.error("Vercel API error:", vercelData);
          return NextResponse.json(
            {
              success: true,
              verified: true,
              message: "Domain verified, but failed to add to Vercel",
            },
            { status: 200 }
          );
        }

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
