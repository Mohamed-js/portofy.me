import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: "atefcloud",
  api_key: "824336462488539",
  api_secret: "pEGHRdxPduNoMq8eWAu3c361h7E",
});

export async function POST(request) {
  try {
    // Connect to MongoDB
    await dbConnect();

    // 1) Get user from cookies
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId");
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    // 2) Fetch user and check plan/storage
    const user = await User.findById(userId.value);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Define storage limits (in bytes)
    const storageLimits = {
      free: 20 * 1024 * 1024, // 20MB
      pro: 1 * 1024 * 1024 * 1024, // 1GB
    };
    const limit = storageLimits[user.plan || "free"]; // Default to free if no plan

    // 3) Parse form data
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // 4) Check file size against storage limit
    const fileSize = file.size; // Size in bytes
    const currentStorage = user.storageUsed || 0;
    if (currentStorage + fileSize > limit) {
      return NextResponse.json(
        {
          success: false,
          error: `Storage limit exceeded (${
            user.plan === "pro" ? "1GB" : "20MB"
          })—upgrade or delete files.`,
        },
        { status: 403 }
      );
    }

    // 5) Convert Blob -> Buffer -> base64 string
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = `data:${file.type};base64,${buffer.toString(
      "base64"
    )}`;

    // 6) Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(base64String, {
      folder: "portofy-me",
      resource_type: "image",
      format: "webp",
      quality: "auto",
    });

    // 7) Update user's storage usage
    user.storageUsed = currentStorage + fileSize;
    await user.save();

    // 8) Return Cloudinary URL and publicId
    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
