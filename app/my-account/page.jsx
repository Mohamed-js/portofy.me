// app/my-account/page.js
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Portfolio from "@/models/Portfolio";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import CreateAppForm from "./CreateAppForm";

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
    const effectivePlan =
      user.plan === "pro" &&
      user.subscriptionEnd &&
      new Date(user.subscriptionEnd) > new Date()
        ? "pro"
        : "free";

    return (
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold text-white mb-6">My Dashboard</h1>
        <div className="mb-8">
          <h2 className="text-xl text-gray-300 mb-2">Plan: {effectivePlan}</h2>
          <Link
            href="/my-account/subscription"
            className="text-blue-500 hover:underline"
          >
            Manage Subscription
          </Link>
        </div>
        <div className="mb-8">
          <h2 className="text-xl text-gray-300 mb-4">Your Apps</h2>
          {portfolios.length === 0 ? (
            <p className="text-gray-400">You haven’t created any apps yet.</p>
          ) : (
            <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((portfolio) => (
                <li
                  key={portfolio._id}
                  className="p-4 bg-neutral-900 rounded-lg shadow-md"
                >
                  <Link href={`/my-account/${portfolio.slug}`}>
                    <h3 className="text-lg font-semibold text-white">
                      {portfolio.title || "Untitled"}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Type: {portfolio.type}
                    </p>
                    <p className="text-sm text-gray-400">
                      Slug: {portfolio.slug}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <CreateAppForm />
      </div>
    );
  } catch (error) {
    console.error("Error loading MyAccount:", error);
    notFound();
  }
}
