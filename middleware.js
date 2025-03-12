// middleware.js
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname, host } = request.nextUrl;
  const defaultDomain =
    process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || "portofyme.vercel.app";

  console.log("Middleware triggered for:", { pathname, host });
  console.log("Default Domain:", defaultDomain);
  console.log("Host:", host);

  if (host === defaultDomain) {
    console.log("Host is default domain, skipping...");
    return NextResponse.next();
  }

  // Rewrite root path to /custom-domain for custom domains
  if (pathname === "/" && pathname !== "/custom-domain") {
    console.log("Rewriting", pathname, "to /custom-domain for", host);
    return NextResponse.rewrite(new URL("/custom-domain", request.url));
  }

  console.log("No rewrite needed for:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // Match all except API, _next, static files
};
