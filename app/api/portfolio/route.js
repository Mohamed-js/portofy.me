import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";

export async function PATCH(req) {
  try {
    await dbConnect();

    const { data } = await req.json();

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID not found" },
        { status: 404 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Compute effective plan
    const effectivePlan =
      user.plan === "pro" &&
      user.subscriptionEnd &&
      new Date(user.subscriptionEnd) > new Date()
        ? "pro"
        : "free";

    // Filter out protected fields
    const { plan, subscriptionEnd, ...filteredData } = data;

    // Define Pro-only fields
    const proOnlyFields = ["projects", "experience", "skills", "seo"];

    // Check if any restricted fields have changed
    const restrictedFieldsChanged = proOnlyFields.some((field) => {
      // Convert both to JSON strings for deep comparison (handles arrays/objects)
      const currentValue = JSON.stringify(user[field] || null);
      const newValue = JSON.stringify(filteredData[field] || null);
      return currentValue !== newValue;
    });

    if (effectivePlan === "free" && restrictedFieldsChanged) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Upgrade to Pro to update projects, experience, skills, or SEO",
        },
        { status: 403 }
      );
    }

    // If username is being updated, check for uniqueness
    if (filteredData.username && filteredData.username !== user.username) {
      const existingUser = await User.findOne({
        username: { $regex: new RegExp(`^${filteredData.username}$`, "i") },
        _id: { $ne: userId },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Username already taken" },
          { status: 409 }
        );
      }
    }

    // Enforce Free plan theme restriction
    if (
      effectivePlan === "free" &&
      filteredData.theme &&
      filteredData.theme !== "minimal" &&
      filteredData.theme !== user.theme
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Free users are restricted to the Minimal theme",
        },
        { status: 403 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(userId, filteredData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
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
