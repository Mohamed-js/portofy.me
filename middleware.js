import { NextResponse } from "next/server";
import Portfolio from "@/models/Portfolio";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function middleware(request) {
  const { pathname, host } = request.nextUrl;
  const defaultDomain =
    process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || "portofyme.vercel.app";

  console.log("defaultDomain", defaultDomain);

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

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
