// app/api/portfolio/[slug]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import { cookies } from "next/headers";

export async function PATCH(req, { params }) {
  await dbConnect();
  const { slug } = params;
  const { data } = await req.json();
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const portfolio = await Portfolio.findOne({ slug, user: userId });
  if (!portfolio) {
    return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
  }

  // Update portfolio with new data
  Object.assign(portfolio, data);
  await portfolio.save();

  return NextResponse.json({ success: true, data: portfolio });
}