// app/my-account/[slug]/page.js
import dbConnect from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User"; // Added User import
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Content from "./Content";

export default async function PortfolioEditor({ params, searchParams }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      notFound();
    }

    // Fetch User to calculate effectivePlan
    const user = await User.findById(userId)
      .select("plan subscriptionEnd")
      .lean();
    if (!user) {
      notFound();
    }

    const effectivePlan =
      user.plan === "pro" &&
      user.subscriptionEnd &&
      new Date(user.subscriptionEnd) > new Date()
        ? "pro"
        : "free";

    const portfolio = await Portfolio.findOne({ slug, user: userId }).lean();
    if (!portfolio) {
      notFound();
    }

    const sanitizedPortfolio = {
      ...portfolio,
      _id: portfolio._id.toString(),
      userId: userId.toString(),
      effectivePlan, // Include in portfolio data, not searchParams
    };

    return (
      <div className="p-4">
        <Content initialPortfolio={JSON.stringify(sanitizedPortfolio)} />
      </div>
    );
  } catch (error) {
    console.error("Error loading PortfolioEditor:", error);
    notFound();
  }
}
