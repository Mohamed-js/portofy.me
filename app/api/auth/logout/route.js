import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = await cookies();

    cookieStore.delete("userId");
    cookieStore.delete("user");

    return NextResponse.json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {}
}
