import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 py-6 mt-10">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between md:items-center text-gray-300">
        {/* Left: Branding */}
        <div className="mb-4 md:mb-0">
          <Link
            href="/"
            className="text-lg font-semibold text-white hover:text-[#fd9c46] transition-colors duration-200"
          >
            Portofy.me
          </Link>
          <p className="text-sm mt-1">
            © {new Date().getFullYear()} Portofy.me. All rights reserved.
          </p>
        </div>

        {/* Right: Links */}
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
        </nav>
      </div>
    </footer>
  );
}
