import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Content from "./Content";

export default async function MyAccount() {
  await dbConnect();
  const cookieStore = await cookies();

  const userId = cookieStore.get("userId");
  if (!userId) {
    notFound();
  }
  const user = await User.findById(userId.value);
  if (!user) {
    notFound();
  }

  return (
    <div>
      <Content initialUser={JSON.stringify(user)} />
    </div>
  );
}
