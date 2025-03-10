import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      username,
      plan = "free",
      billingPeriod,
      confirm_password,
    } = await req.json();

    // Validation
    if (password !== confirm_password) {
      return NextResponse.json(
        { success: false, message: "Passwords don't match" },
        { status: 400 }
      );
    }
    if (!/^[a-zA-Z0-9._-]{3,}$/.test(username)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Username must be at least 3 characters (letters, numbers, ._- only)",
        },
        { status: 400 }
      );
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
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
      plan,
      billingPeriod: plan === "pro" ? billingPeriod : null,
      subscriptionEnd:
        plan === "pro"
          ? new Date(
              Date.now() +
                (billingPeriod === "annual" ? 365 : 30) * 24 * 60 * 60 * 1000
            )
          : null,
    });

    // Set cookie in response
    const response = NextResponse.json({
      success: true,
      message: "User registered successfully",
      data: { userId: user._id, username: user.username },
    });
    response.cookies.set("userId", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
