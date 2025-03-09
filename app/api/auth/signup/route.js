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
    const { firstName, lastName, email, password, phone, username } =
      await req.json();

    // Basic input validation
    if (!firstName || !lastName || !email || !password || !username) {
      return NextResponse.json(
        { success: false, error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error:
            existingUser.email === email
              ? "Email already in use"
              : "Username already taken",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      username,
    });

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set("userId", user._id, {
      httpOnly: true, // Prevents client-side JS access
      secure: process.env.NODE_ENV === "production", // Only HTTPS in production
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      data: { userId: user._id, username: user.username },
    });
  } catch (error) {
    console.error("Signup error:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
