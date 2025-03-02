import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: "atefcloud",
  api_key: "824336462488539",
  api_secret: "pEGHRdxPduNoMq8eWAu3c361h7E",
});

// Disable body parsing is not needed here in the App Router, but we do need to parse formData for small files.
export async function POST(request) {
  try {
    // 1) Parse the multipart form data (expects <input name="file" />).
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // 2) Convert Blob -> Buffer -> base64 string (for Cloudinary)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = `data:${file.type};base64,${buffer.toString(
      "base64"
    )}`;

    // 3) Upload to Cloudinary (storing in original format)
    const uploadResult = await cloudinary.uploader.upload(base64String, {
      folder: "portofy-me", // optional folder
      resource_type: "image", // "image" is default, but let's be explicit
      format: "webp", // Convert and store as WebP
      quality: "auto",
    });

    // 4) Return Cloudinary URL and publicId
    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
