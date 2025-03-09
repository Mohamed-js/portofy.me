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
        { message: "User ID not found" },
        { status: 404 }
      );
    }

    // If username is being updated, check for uniqueness
    if (data.username) {
      const existingUser = await User.findOne({
        username: { $regex: new RegExp(`^${data.username}$`, "i") },
        _id: { $ne: userId.value }, // Exclude the current user
      });

      if (existingUser) {
        return NextResponse.json(
          { message: "Username already taken" },
          { status: 409 } // Conflict status
        );
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId.value, data, {
      new: true,
      runValidators: true, // Ensure schema validation runs
    });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    return NextResponse.json(
      {
        success: false,
        error: "Updating user failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
