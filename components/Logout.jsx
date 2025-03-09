// Logout.js
"use client";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        toast.success("Logged out successfully");
        router.push("/login");
        router.refresh(); // Refresh to update server components
      } else {
        toast.error(data.error || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="hover:text-blue-400 transition-colors cursor-pointer"
    >
      Logout
    </button>
  );
};

export default Logout;
