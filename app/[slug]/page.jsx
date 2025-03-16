import dbConnect from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

import LIBioThemer from "../../Themes/LIBioThemes/Themer";
import PortfolioThemer from "../../Themes/PortfolioThemes/Themer";

import {
  Almarai,
  Cairo,
  Changa,
  Lato,
  Merriweather_Sans,
  Open_Sans,
  Poppins,
  Roboto_Slab,
  Roboto,
  Tajawal,
} from "@next/font/google";

const almarai = Almarai({ subsets: ["arabic"], weight: ["300", "400", "700"] });
const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "700"] });
const changa = Changa({ subsets: ["arabic"], weight: ["400", "700"] });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"] });
const merriweatherSans = Merriweather_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const openSans = Open_Sans({ subsets: ["latin"], weight: ["400", "700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });
const robotoSlab = Roboto_Slab({ subsets: ["latin"], weight: ["400", "700"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });
const tajawal = Tajawal({ subsets: ["arabic"], weight: ["400", "700"] });

export const fontMap = {
  openSans,
  poppins,
  robotoSlab,
  roboto,
  almarai,
  changa,
  tajawal,
  merriweatherSans,
  cairo,
  lato,
};

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

  const plainUser = JSON.parse(JSON.stringify(user));
  const plainPortfolio = JSON.parse(JSON.stringify(portfolio));

  if (plainPortfolio.type === "social-links") {
    return <LIBioThemer portfolio={plainPortfolio} user={plainUser} />;
  } else if (plainPortfolio.type === "portfolio") {
    return <PortfolioThemer portfolio={plainPortfolio} user={plainUser} />;
  }
}

export const dynamic = "force-dynamic";
