"use client";
import { toast } from "react-toastify";

const Logout = () => {
  return (
    <button
      className="cursor-pointer"
      onClick={() => {
        fetch("/api/auth/logout", {
          method: "POST",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              toast.success("Logged Out Successfully.");
              window.location.href = "/";
            }
          });
      }}
    >
      Logout
    </button>
  );
};

export default Logout;
