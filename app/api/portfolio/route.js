// app/api/portfolio/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import Portfolio from "@/models/Portfolio";

export async function POST(req) {
  try {
    await dbConnect();
    const { title, slug, type } = await req.json(); // Removed effectivePlan
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate effectivePlan server-side
    const effectivePlan =
      user.plan === "pro" &&
      user.subscriptionEnd &&
      new Date(user.subscriptionEnd) > new Date()
        ? "pro"
        : "free";

    const existingPortfolio = await Portfolio.findOne({ slug });
    if (existingPortfolio) {
      return NextResponse.json(
        { error: "Slug already taken" },
        { status: 409 }
      );
    }

    const validTypes =
      effectivePlan === "free"
        ? ["social-links"]
        : ["portfolio", "social-links"];

    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid app type" }, { status: 400 });
    }

    const portfolioCount = await Portfolio.countDocuments({ user: userId });
    if (effectivePlan === "free" && portfolioCount >= 1) {
      return NextResponse.json(
        { error: "Upgrade to Pro to create more apps" },
        { status: 403 }
      );
    }

    const portfolio = new Portfolio({
      user: userId,
      slug,
      title,
      type,
      theme: "minimal",
      socialLinks: [],
      projects: [],
      skills: [],
      experience: [],
      seoMeta: { title: "", description: "", keywords: [] },
    });

    await portfolio.save();

    return NextResponse.json(
      { success: true, portfolio: portfolio.toObject() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH handler remains unchanged (it’s already correct for portfolio updates)
export async function PATCH(req) {
  try {
    await dbConnect();

    const { data } = await req.json();

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID not found" },
        { status: 404 }
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

    const portfolio = await Portfolio.findOne({
      slug: data.slug,
      user: userId,
    });
    if (!portfolio) {
      return NextResponse.json(
        { success: false, message: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Define Pro-only fields
    const proOnlyFields = ["projects", "experience", "skills", "seoMeta"]; // Adjusted to match Portfolio schema

    // Check if any restricted fields have changed
    const restrictedFieldsChanged = proOnlyFields.some((field) => {
      const currentValue = JSON.stringify(portfolio[field] || null);
      const newValue = JSON.stringify(data[field] || null);
      return currentValue !== newValue;
    });

    if (effectivePlan === "free" && restrictedFieldsChanged) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Upgrade to Pro to update projects, experience, skills, or SEO",
        },
        { status: 403 }
      );
    }

    // Enforce Free plan theme restriction
    if (
      effectivePlan === "free" &&
      data.theme &&
      data.theme !== "minimal" &&
      data.theme !== portfolio.theme
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Free users are restricted to the Minimal theme",
        },
        { status: 403 }
      );
    }

    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { slug: data.slug, user: userId },
      data,
      { new: true, runValidators: true }
    );

    if (!updatedPortfolio) {
      return NextResponse.json(
        { success: false, message: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPortfolio.toObject(),
    });
  } catch (error) {
    console.error("Error updating portfolio:", error.message);
    return NextResponse.json(
      {
        success: false,
        error: "Updating portfolio failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
