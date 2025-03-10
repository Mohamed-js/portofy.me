import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Content from "./Content";

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

    const effectivePlan =
      user.plan === "pro" &&
      user.subscriptionEnd &&
      new Date(user.subscriptionEnd) > new Date()
        ? "pro"
        : "free";

    const sanitizedUser = {
      ...user,
      _id: user._id.toString(),
      effectivePlan, // Add this to user object
    };

    return (
      <div>
        <Content initialUser={JSON.stringify(sanitizedUser)} />
      </div>
    );
  } catch (error) {
    console.error("Error loading MyAccount:", error);
    notFound(); // Or redirect to an error page if preferred
  }
}
