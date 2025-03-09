"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    firstName: "",
    lastName: "",
    phone: "",
    employment: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Client-side validation
    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords don't match!");
      setLoading(false);
      return;
    }
    if (!/^[a-zA-Z0-9._-]{3,}$/.test(formData.username)) {
      toast.error(
        "Username must be at least 3 characters (letters, numbers, ._- only)"
      );
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Signed Up Successfully!");
        router.push("/");
        router.refresh();
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen mt-24">
      <div className="w-full max-w-md p-4 mx-4 bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Sign Up for Portofy.me
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Username (must be unique)
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-gray-900 bg-gray-50/80 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none placeholder-gray-400"
              placeholder="johndoe"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-gray-900 bg-gray-50/80 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none placeholder-gray-400"
              placeholder="example@gmail.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-gray-900 bg-gray-50/80 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none placeholder-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirm_password"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm_password"
              id="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-gray-900 bg-gray-50/80 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none placeholder-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          {/* First Name & Last Name */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-gray-900 bg-gray-50/80 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none placeholder-gray-400"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-gray-900 bg-gray-50/80 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none placeholder-gray-400"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-gray-900 bg-gray-50/80 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e45053] focus:border-[#e45053] outline-none placeholder-gray-400"
              placeholder="123-456-7890"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-5 py-2.5 text-sm font-semibold text-white bg-linear-to-bl from-[#e45053] to-[#fd9c46] rounded-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  />
                </svg>
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#e45053] hover:text-[#fd9c46] font-medium underline transition-colors duration-200"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
