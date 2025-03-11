// app/[username]/page.js
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Cover from "./minimal/Cover"; // Import the client component
import Navbar from "./minimal/Navbar";
import Footer from "./minimal/Footer";

export async function generateMetadata({ params }) {
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

  const effectivePlan =
    user.plan === "pro" &&
    user.subscriptionEnd &&
    new Date(user.subscriptionEnd) > new Date()
      ? "pro"
      : "free";

  if (effectivePlan === "free") {
    return {
      title: `${user.firstName} ${user.lastName}`,
    };
  }

  return {
    title: `${user.firstName[0].toUpperCase() + user.firstName.substring(1)} ${
      user.lastName[0].toUpperCase() + user.lastName.substring(1)
    }`,
    description: user.bio,
    icons: {
      icon: user.avatar,
    },
    openGraph: {
      title: `${
        user.firstName[0].toUpperCase() + user.firstName.substring(1)
      } ${user.lastName[0].toUpperCase() + user.lastName.substring(1)}`,
      description: user.bio,
      images: [user.avatar],
    },
    twitter: {
      card: "summary_large_image",
      title: `${
        user.firstName[0].toUpperCase() + user.firstName.substring(1)
      } ${user.lastName[0].toUpperCase() + user.lastName.substring(1)}`,
      description: user.bio,
      images: [user.avatar],
    },
  };
}

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
      <Footer user={user} />
    </>
  );
}

export const dynamic = "force-dynamic";
