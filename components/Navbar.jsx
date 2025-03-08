import { cookies } from "next/headers";
import Link from "next/link";
import Logout from "./Logout";

const Navbar = async () => {
  const cookieStore = await cookies();
  const user = cookieStore.get("user")?.value;

  return (
    <nav className="flex items-center justify-between p-4 px-8 text-white fixed top-0 w-full left-0 shadow-md z-50 backdrop-blur">
      <Link href="/">Portofy.me</Link>

      <span>
        {user ? (
          <>
            <Link href="/my-account" className="mr-4">
              My Account
            </Link>
            <Logout />
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </span>
    </nav>
  );
};

export default Navbar;
