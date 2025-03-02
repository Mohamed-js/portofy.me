import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user)
      return Response.json({ message: "Invalid Credentials" }, { status: 400 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return Response.json({ message: "Invalid Credentials" }, { status: 400 });

    const cookieStore = await cookies();

    cookieStore.set("userId", user._id);
    cookieStore.set("user", user);

    return NextResponse.json({
      success: true,
      message: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error logging user:", error.response?.data || error.message);

    return NextResponse.json(
      {
        success: false,
        error:
          error.response?.data?.message || "Login failed. Please try again.",
      },
      { status: error.response?.status || 500 }
    );
  }
}
