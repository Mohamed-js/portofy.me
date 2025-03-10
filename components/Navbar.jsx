import { cookies } from "next/headers";
import Link from "next/link";
import Logout from "./Logout";
import Image from "next/image";

const Navbar = async () => {
  // Get userId from cookies
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md p-4 md:px-8 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-bold hover:text-blue-400 transition-colors"
        >
          <Image src="/portofy.webp" alt="logo" height={20} width={100} />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          {userId ? (
            <>
              <Link
                href="/my-account"
                className="hover:text-blue-400 transition-colors min-w-fit"
              >
                My Account
              </Link>
              <Logout />
            </>
          ) : (
            <Link
              href="/login"
              className="hover:text-blue-400 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
