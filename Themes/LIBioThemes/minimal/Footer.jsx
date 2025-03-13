"use client";

import Link from "next/link";

export default function Footer({ portfolio, user }) {
  const effectivePlan =
    user.plan === "pro" &&
    user.subscriptionEnd &&
    new Date(user.subscriptionEnd) > new Date()
      ? "pro"
      : "free";

  return (
    <footer className="fixed bottom-0 left-0 w-full py-3 md:py-6 mt-10">
      <div className="mx-auto px-6 flex flex-col md:flex-row justify-between md:items-center text-gray-300">
        {/* Left: Branding */}
        <div className="mb-4 md:mb-0">
          {effectivePlan === "free" ? (
            <Link
              href="/"
              className="text-lg font-semibold text-white hover:text-[#fd9c46] transition-colors duration-200"
            >
              Portofy.me
            </Link>
          ) : (
            <Link
              href={`/${portfolio.slug}`}
              className="text-lg font-semibold text-white hover:text-[#fd9c46] transition-colors duration-200"
            >
              {portfolio.title[0].toUpperCase()}
              {portfolio.title.substring(1)}
            </Link>
          )}

          <p className="text-sm mt-1">
            © {new Date().getFullYear()}{" "}
            {effectivePlan === "free" ? "Portofy.me" : portfolio.title}. All
            rights reserved.
          </p>
        </div>

        {/* Right: Links */}
        {effectivePlan === "free" && (
          <nav className="flex gap-6">
            <Link
              href="/#pricing"
              className="text-sm hover:text-[#e45053] transition-colors duration-200"
            >
              Pricing
            </Link>
            <Link
              href="/#contact"
              className="text-sm hover:text-[#e45053] transition-colors duration-200"
            >
              Contact
            </Link>
            <Link
              href="/signup"
              className="text-sm hover:text-[#e45053] transition-colors duration-200"
            >
              Join Us Now!
            </Link>
          </nav>
        )}
      </div>
    </footer>
  );
}
