// app/my-account/page.js
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Portfolio from "@/models/Portfolio";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import MyAccountClient from "./MyAccountClient";

export const dynamic = "force-dynamic"; // Ensure fresh render with query params

export default async function MyAccount() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      notFound();
    }

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      notFound();
    }

    const portfolios = await Portfolio.find({ user: userId }).lean();

    // Convert user to a plain object with simple values
    const plainUser = {
      _id: user._id.toString(),
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      email: user.email || "",
      plan: user.plan || "free",
      billingPeriod: user.billingPeriod || "",
      subscriptionEnd: user.subscriptionEnd
        ? new Date(user.subscriptionEnd).toISOString()
        : null,
      storageUsed: user.storageUsed || 0,
      createdAt: new Date(user.createdAt).toISOString(),
      updatedAt: new Date(user.updatedAt).toISOString(),
      stripeCustomerId: user.stripeCustomerId || "",
    };

    // Convert portfolios to plain objects with simple values
    const plainPortfolios = portfolios.map((portfolio) => ({
      _id: portfolio._id.toString(),
      user: portfolio.user.toString(),
      title: portfolio.title || "",
      slug: portfolio.slug || "",
      type: portfolio.type || "portfolio",
      avatar: portfolio.avatar || "",
      cover: portfolio.cover || "",
      createdAt: new Date(portfolio.createdAt).toISOString(),
      updatedAt: new Date(portfolio.updatedAt).toISOString(),
    }));

    const effectivePlan =
      user.plan === "pro" &&
      user.subscriptionEnd &&
      new Date(user.subscriptionEnd) > new Date()
        ? "pro"
        : "free";

    return (
      <MyAccountClient
        initialPortfolios={plainPortfolios}
        effectivePlan={effectivePlan}
      />
    );
  } catch (error) {
    console.error("Error loading MyAccount:", error);
    notFound();
  }
}
