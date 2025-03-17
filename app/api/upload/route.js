import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";

cloudinary.config({
  cloud_name: "atefcloud",
  api_key: "824336462488539",
  api_secret: "pEGHRdxPduNoMq8eWAu3c361h7E",
});

export async function POST(request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId");
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId.value);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check subscription status
    if (
      user.plan === "pro" &&
      user.subscriptionEnd &&
      user.subscriptionEnd < new Date()
    ) {
      user.plan = "free";
      user.billingPeriod = null;
      user.subscriptionEnd = null;
      await user.save();
      return NextResponse.json(
        { success: false, message: "Subscription expired—downgraded to Free" },
        { status: 403 }
      );
    }

    // Define storage limits (in bytes)
    const storageLimits = {
      free: 20 * 1024 * 1024, // 20MB
      pro: 1 * 1024 * 1024 * 1024, // 1GB
    };
    const limit = storageLimits[user.plan || "free"];

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    const fileSize = file.size;

    console.log(
      "User: " + user._id + " uploaded a file with size: " + fileSize
    );
    const maxFileSize = 10 * 1024 * 1024; // 10MB per file
    if (fileSize > maxFileSize) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const currentStorage = user.storageUsed || 0;
    if (currentStorage + fileSize > limit) {
      return NextResponse.json(
        {
          success: false,
          message: `Storage limit exceeded (${
            user.plan === "pro" ? "1GB" : "20MB"
          })—upgrade or delete files`,
        },
        { status: 403 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = `data:${file.type};base64,${buffer.toString(
      "base64"
    )}`;

    const uploadResult = await cloudinary.uploader.upload(base64String, {
      folder: "portofy-me",
      resource_type: "image",
      format: "webp",
      quality: "auto",
    });

    user.storageUsed += currentStorage + fileSize;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      storageUsed: user.storageUsed,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
