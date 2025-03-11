// app/[slug]/page.js
import dbConnect from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Cover from "./minimal/Cover";
import Navbar from "./minimal/Navbar";
import Footer from "./minimal/Footer";

export async function generateMetadata({ params }) {
  await dbConnect();
  const { slug } = await params;
  const headersList = await headers();
  const host = headersList.get("host");
  const defaultDomain = process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || "yourapp.com";

  let portfolio;

  if (host !== defaultDomain) {
    portfolio = await Portfolio.findOne({ customDomain: host, domainVerified: true });
    if (!portfolio) {
      notFound();
    }
  } else {
    portfolio = await Portfolio.findOne({ slug });
    if (!portfolio) {
      notFound();
    }
  }

  const user = await User.findById(portfolio.user);
  if (!user) {
    return { title: portfolio.title || "Portfolio" };
  }

  const effectivePlan =
    user.plan === "pro" &&
    user.subscriptionEnd &&
    new Date(user.subscriptionEnd) > new Date()
      ? "pro"
      : "free";

  if (effectivePlan === "free") {
    return {
      title: portfolio.title || "Portfolio",
    };
  }

  return {
    title: portfolio.seoMeta?.title || portfolio.title || "Portfolio",
    description: portfolio.seoMeta?.description || "",
    icons: {
      icon: portfolio.avatar || "/default-avatar.png",
    },
    openGraph: {
      title: portfolio.seoMeta?.title || portfolio.title || "Portfolio",
      description: portfolio.seoMeta?.description || "",
      images: [portfolio.avatar || "/default-avatar.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: portfolio.seoMeta?.title || portfolio.title || "Portfolio",
      description: portfolio.seoMeta?.description || "",
      images: [portfolio.avatar || "/default-avatar.png"],
    },
  };
}

export default async function PortfolioPage({ params }) {
  await dbConnect();
  const { slug } = await params;
  const headersList = await headers();
  const host = headersList.get("host");
  const defaultDomain = process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || "yourapp.com";

  let portfolio;

  if (host !== defaultDomain) {
    portfolio = await Portfolio.findOne({ customDomain: host, domainVerified: true });
    if (!portfolio) {
      notFound();
    }
  } else {
    portfolio = await Portfolio.findOne({ slug });
    if (!portfolio) {
      notFound();
    }
  }

  const user = await User.findById(portfolio.user); // Fetch user for plan info
  if (!user) {
    notFound(); // Rare case, but ensures consistency
  }

  return (
    <>
      <Navbar portfolio={portfolio} user={user} />
      <Cover portfolio={portfolio} />
      <Footer portfolio={portfolio} user={user} />
    </>
  );
}

export const dynamic = "force-dynamic";