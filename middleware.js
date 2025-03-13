// middleware.js
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname, host } = request.nextUrl;
  const defaultDomain =
    process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || "portofyme.vercel.app";

  if (host === defaultDomain) {
    return NextResponse.next();
  }

  if (pathname === "/" && pathname !== "/custom-domain") {
    return NextResponse.rewrite(new URL("/custom-domain", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // Match all except API, _next, static files
};
