import dbConnect from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Cover from "./minimal/Cover";
import Navbar from "./minimal/Navbar";
import Footer from "./minimal/Footer";

// Utility function to capitalize the first letter of each word
function capitalizeTitle(str) {
  if (!str) return str;
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export async function generateMetadata({ params }) {
  await dbConnect();
  const { slug } = await params;
  const headersList = await headers();
  const host = headersList.get("host");
  const defaultDomain = process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || "yourapp.com";

  let portfolio;

  if (host !== defaultDomain) {
    portfolio = await Portfolio.findOne({
      customDomain: host,
      domainVerified: true,
    }).lean();
    if (!portfolio) {
      notFound();
    }
  } else {
    portfolio = await Portfolio.findOne({ slug }).lean();
    if (!portfolio) {
      notFound();
    }
  }

  const user = await User.findById(portfolio.user).lean();
  if (!user) {
    return { title: capitalizeTitle(portfolio.title) || "Portfolio" };
  }

  const effectivePlan =
    user.plan === "pro" &&
    user.subscriptionEnd &&
    new Date(user.subscriptionEnd) > new Date()
      ? "pro"
      : "free";

  if (effectivePlan === "free") {
    return {
      title: capitalizeTitle(portfolio.title) || "Portfolio",
    };
  }

  return {
    title:
      capitalizeTitle(portfolio.seoMeta?.title) ||
      capitalizeTitle(portfolio.title) ||
      "Portfolio",
    description: portfolio.seoMeta?.description || "",
    icons: {
      icon: portfolio.avatar || "/default-avatar.png",
    },
    openGraph: {
      title:
        capitalizeTitle(portfolio.seoMeta?.title) ||
        capitalizeTitle(portfolio.title) ||
        "Portfolio",
      description: portfolio.seoMeta?.description || "",
      images: [portfolio.avatar || "/default-avatar.png"],
    },
    twitter: {
      card: "summary_large_image",
      title:
        capitalizeTitle(portfolio.seoMeta?.title) ||
        capitalizeTitle(portfolio.title) ||
        "Portfolio",
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
    portfolio = await Portfolio.findOne({
      customDomain: host,
      domainVerified: true,
    }).lean();
    if (!portfolio) {
      notFound();
    }
  } else {
    portfolio = await Portfolio.findOne({ slug }).lean();
    if (!portfolio) {
      notFound();
    }
  }

  const user = await User.findById(portfolio.user).lean();
  if (!user) {
    notFound();
  }

  // Convert portfolio to plain object
  const plainPortfolio = {
    _id: portfolio._id.toString(),
    user: portfolio.user.toString(),
    title: portfolio.title || "",
    subTitle: portfolio.subTitle || "",
    description: portfolio.description || "",
    slug: portfolio.slug || "",
    type: portfolio.type || "portfolio",
    avatar: portfolio.avatar || "",
    cover: portfolio.cover || "",
    socialLinks: portfolio.socialLinks || "",
    customDomain: portfolio.customDomain || "",
    domainVerified: portfolio.domainVerified || false,
    seoMeta: {
      title: portfolio.seoMeta?.title || "",
      description: portfolio.seoMeta?.description || "",
      keywords: portfolio.seoMeta?.keywords || [],
    },
    createdAt: new Date(portfolio.createdAt).toISOString(),
    updatedAt: new Date(portfolio.updatedAt).toISOString(),
    // Add other fields like projects, experience, etc., if needed
  };

  // Convert user to plain object
  const plainUser = {
    _id: user._id.toString(),
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
    email: user.email || "",
    plan: user.plan || "free",
    billingPeriod: user.billingPeriod || "",
    subscriptionEnd: user.subscriptionEnd
      ? new Date(user.subscriptionEnd).toISOString()
      : null,
    storageUsed: user.storageUsed || 0,
    createdAt: new Date(user.createdAt).toISOString(),
    updatedAt: new Date(user.updatedAt).toISOString(),
    stripeCustomerId: user.stripeCustomerId || "",
  };

  return (
    <>
      <Navbar portfolio={plainPortfolio} user={plainUser} />
      <Cover portfolio={plainPortfolio} />
      <Footer portfolio={plainPortfolio} user={plainUser} />
    </>
  );
}

export const dynamic = "force-dynamic";
