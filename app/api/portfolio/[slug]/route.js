import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import { cookies } from "next/headers";

export async function PATCH(req, { params }) {
  await dbConnect();
  const { slug } = params; // Current slug from URL (for reference, not query)
  const { data } = await req.json();
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!data._id) {
    return NextResponse.json(
      { error: "Portfolio ID is required" },
      { status: 400 }
    );
  }

  try {
    // Validate slug format if provided
    if (data.slug) {
      if (!/^[a-z0-9-]+$/.test(data.slug)) {
        return NextResponse.json(
          {
            error:
              "Slug must be lowercase, contain only letters, numbers, or hyphens, and no spaces",
          },
          { status: 400 }
        );
      }

      // Reserved slugs list
      const reservedSlugs = [
        // Current app routes
        "subscription",
        "login",
        "signup",
        "my-account",
        "dashboard",
        "portfolio",
        "link-in-bio", // Possible type-specific route

        // Common Next.js reserved routes
        "api",
        "_next",
        "static",
        "public",
        "favicon.ico",

        // Potential future routes
        "profile",
        "settings",
        "account",
        "billing",
        "payments",
        "projects",
        "experience",
        "skills",
        "seo",
        "social-links",
        "admin",
        "support",
        "help",
        "about",
        "contact",
        "terms",
        "privacy",
        "blog",
        "news",
        "explore",
        "search",

        // Generic terms to avoid confusion
        "app",
        "home",
        "index",
        "user",
        "users",
        "edit",
        "new",
        "create",
      ];

      if (reservedSlugs.includes(data.slug)) {
        return NextResponse.json(
          { error: "This slug is reserved and cannot be used." },
          { status: 400 }
        );
      }

      // Check for slug duplication
      const existingPortfolio = await Portfolio.findOne({
        slug: data.slug,
        _id: { $ne: data._id }, // Exclude the current portfolio
      });
      if (existingPortfolio) {
        return NextResponse.json(
          { error: "This slug is already taken, use another unique one." },
          { status: 409 }
        );
      }
    }

    if (data.customDomain) {
      const currentPortfolio = await Portfolio.findById(data._id);
      if (
        currentPortfolio &&
        data.customDomain !== currentPortfolio.customDomain
      ) {
        data.domainVerified = false; // Reset verification status
      }
    }

    // Update the portfolio by _id
    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: data._id },
      { $set: data }, // Update only provided fields
      { new: true } // Return the updated document
    );

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: portfolio });
  } catch (error) {
    console.error("Portfolio update error:", error);
    return NextResponse.json(
      { error: "Server error during update" },
      { status: 500 }
    );
  }
}
