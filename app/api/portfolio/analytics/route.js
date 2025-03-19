import dbConnect from "@/lib/db";
import PortfolioAnalytics from "@/models/PortfolioAnalytics";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const { portfolioId, events } = await req.json();

  if (!events || !Array.isArray(events) || events.length === 0) {
    return NextResponse.json({ success: false, message: "No events provided" });
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    "unknown";

  // Add IP to each event
  const enrichedEvents = events.map((event) => ({
    ...event,
    ip,
  }));

  await PortfolioAnalytics.findOneAndUpdate(
    { portfolioId },
    { $push: { events: { $each: enrichedEvents } } },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}

export async function GET(req) {
  await dbConnect();

  const portfolioId = new URL(req.url).searchParams.get("portfolioId");

  if (!portfolioId)
    return NextResponse.json({ message: "Missing portfolioId" });

  const analytics = await PortfolioAnalytics.findOne({ portfolioId });

  if (!analytics) return NextResponse.json({ message: "No analytics found" });

  //   const pageViewEvents = analytics.events.filter((e) => e.type === "page_view");

  const data = {
    events: analytics.events,
    pageViews: analytics.events.filter((e) => e.type === "page_view").length,
    clicks: analytics.events.filter((e) => e.type === "click"),
    scrolls: analytics.events.filter((e) => e.type === "scroll_depth"),
    devices: {
      mobile: analytics.events.filter(
        (e) => e.device === "mobile" && e.type === "page_view"
      ).length,
      desktop: analytics.events.filter(
        (e) => e.device === "desktop" && e.type === "page_view"
      ).length,
    },
    referrers: [
      ...new Set(analytics.events.map((e) => e.referrer).filter(Boolean)),
    ],
    userAgents: [
      ...new Set(analytics.events.map((e) => e.userAgent).filter(Boolean)),
    ],
    ips: [...new Set(analytics.events.map((e) => e.ip).filter(Boolean))],
  };

  return NextResponse.json(data);
}
