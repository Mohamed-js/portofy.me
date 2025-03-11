// app/my-account/subscription/page.js
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import SubscriptionClient from "./SubscriptionClient";

export default async function Subscription() {
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

  const effectivePlan =
    user.plan === "pro" &&
    user.subscriptionEnd &&
    new Date(user.subscriptionEnd) > new Date()
      ? "pro"
      : "free";

  const sanitizedUser = {
    ...user,
    _id: user._id.toString(),
    effectivePlan,
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Subscription</h1>
      <SubscriptionClient initialUser={JSON.stringify(sanitizedUser)} />
    </div>
  );
}
