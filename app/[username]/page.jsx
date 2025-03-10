// app/[username]/page.js
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Cover from "./minimal/Cover"; // Import the client component
import Navbar from "./minimal/Navbar";

export default async function Portfolio({ params }) {
  await dbConnect();
  const { username } = await params;
  const headersList = await headers();
  const host = headersList.get("host");
  const defaultDomain = process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || "yourapp.com";

  // Extract cleanUsername using your formula
  const cleanUsername = username.startsWith("@")
    ? username.substring(1)
    : username.startsWith("%40")
    ? username.substring(3)
    : username;

  let user;

  if (host !== defaultDomain) {
    user = await User.findOne({ customDomain: host, domainVerified: true });
    if (!user || user.username !== cleanUsername) {
      notFound();
    }
  } else {
    user = await User.findOne({ username: cleanUsername });
    if (!user) {
      notFound();
    }
  }

  return (
    <>
      <Navbar user={user} />
      <Cover user={user} />
    </>
  );
}

export const dynamic = "force-dynamic";
