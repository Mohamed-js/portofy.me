import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname, host } = request.nextUrl;
  const defaultDomain =
    process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || "portofyme.vercel.app";

  console.log("Middleware triggered for:", { pathname, host });
  console.log("Default Domain:", defaultDomain);

  if (host === defaultDomain) {
    console.log("Host is default domain, skipping...");
    return NextResponse.next();
  }

  try {
    if (pathname === `/custom-domain`) {
      console.log("Rewriting", pathname, "to / for", host);
      return NextResponse.rewrite(new URL("/", request.url));
    }

    console.log("No rewrite needed for:", pathname);
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // Match all except API, _next, static files
};
