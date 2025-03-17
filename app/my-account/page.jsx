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

    const plainPortfolios = JSON.parse(JSON.stringify(portfolios));

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
