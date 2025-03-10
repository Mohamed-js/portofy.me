import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { success: false, error: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    await dbConnect();
    const { email, password } = await req.json();

    // Basic input validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Set cookie with userId only
    const cookieStore = await cookies();
    cookieStore.set("userId", user._id.toString(), {
      httpOnly: true, // Prevents client-side JS access
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      sameSite: "lax",
    });

    return NextResponse.json({
      success: true,
      message: "User logged in successfully",
      data: { userId: user._id, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
