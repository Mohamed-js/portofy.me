import Link from "next/link";
import Image from "next/image";

const Navbar = async ({ user }) => {
  const effectivePlan =
    user.plan === "pro" &&
    user.subscriptionEnd &&
    new Date(user.subscriptionEnd) > new Date()
      ? "pro"
      : "free";
  return (
    <nav className="top-0 left-0 w-full z-50 backdrop-blur-md p-4 md:px-8 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
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
            href={`/@${user.username}`}
            className="font-bold text-sm transition-colors flex gap-2 items-center"
          >
            <div className="w-10 h-10 relative rounded-full overflow-hidden">
              <Image src={user.avatar} alt={user.firstName} fill />
            </div>
            {user.firstName} {user.lastName}
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
