import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";

export async function PATCH(req) {
  try {
    await dbConnect();

    const { data } = await req.json();

    const cookieStore = await cookies();

    const userId = cookieStore.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not Found" },
        { status: 404 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(userId.value, data, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error getting user:", error.message);

    return NextResponse.json(
      {
        success: false,
        error: "Getting user failed.",
      },
      { status: 500 }
    );
  }
}
