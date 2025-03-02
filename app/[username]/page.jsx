import dbConnect from "@/lib/db";
import User from "@/models/User";
import { notFound } from "next/navigation";

export default async function Portfolio({ params }) {
  await dbConnect();
  const { username } = await params;

  const user = await User.findOne({ username: username.substring(3) });

  if (!user) {
    notFound();
  }

  return (
    <div>
      <h1>
        Profile of {user?.firstName} {user?.lastName}
      </h1>
    </div>
  );
}
