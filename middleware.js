// middleware.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Portfolio from "@/models/Portfolio";

export async function middleware(request) {
  const { pathname, host } = request.nextUrl;
  const defaultDomain =
    process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || "portofyme.vercel.app";

  console.log("defaultDomain", defaultDomain);
  // Skip if it's the default domain
  if (host === defaultDomain) {
    return NextResponse.next();
  }

  // Connect to DB
  await dbConnect();

  // Check if it's a custom domain
  const portfolio = await Portfolio.findOne({
    customDomain: host,
    domainVerified: true,
  }).lean();

  if (!portfolio) {
    return NextResponse.next(); // Let it 404 or handle in page
  }

  // If path includes the slug, rewrite to root
  if (pathname === `/${portfolio.slug}`) {
    return NextResponse.rewrite(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
