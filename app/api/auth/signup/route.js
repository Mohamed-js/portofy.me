import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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
      employment,
      username,
    } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      employment,
      username,
    });

    const cookieStore = await cookies();

    cookieStore.set("userId", user._id);
    cookieStore.set("user", user);

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error(
      "Error registering user:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      },
      { status: error.response?.status || 500 }
    );
  }
}
