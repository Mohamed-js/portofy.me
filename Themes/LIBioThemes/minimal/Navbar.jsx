"use client";

import Link from "next/link";
import Image from "next/image";

const Navbar = ({ portfolio, user }) => {
  const effectivePlan =
    user.plan === "pro" &&
    user.subscriptionEnd &&
    new Date(user.subscriptionEnd) > new Date()
      ? "pro"
      : "free";

  return (
    <nav className="hidden md:fixed top-0 left-0 w-full z-50 p-4 md:px-4 text-white">
      <div className="mx-auto flex items-center justify-between">
        {/* Logo */}
        {effectivePlan === "free" ? (
          <Link
            href="/"
            className="text-lg font-bold hover:text-blue-400 transition-colors"
          >
            <Image src="/portofy.webp" alt="logo" height={20} width={100} />
          </Link>
        ) : (
          <Link
            href={`/${portfolio.slug}`}
            className="font-bold text-sm transition-colors flex gap-2 items-center"
          >
            <div className="w-10 h-10 relative rounded-full overflow-hidden">
              <Image
                src={portfolio.avatar || "/default-avatar.png"}
                alt={portfolio.title}
                fill
              />
            </div>
            {portfolio.title[0].toUpperCase()}
            {portfolio.title.substring(1)}
          </Link>
        )}

        {/* Navigation Links */}
        {effectivePlan === "free" && (
          <div className="flex items-center gap-4">
            <Link
              href="/signup"
              className="hover:text-blue-400 transition-colors min-w-fit text-sm"
            >
              Create free account!
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
