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

    // Convert MongoDB _id to string and remove sensitive fields
    const sanitizedUser = {
      ...user,
      _id: user._id.toString(),
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
