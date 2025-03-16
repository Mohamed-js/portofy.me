import { NextResponse } from "next/server";

const EXCHANGE_RATE_API = "https://v6.exchangerate-api.com/v6";

export async function GET() {
  try {
    const response = await fetch(
      `${EXCHANGE_RATE_API}/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`
    );
    const data = await response.json();
    if (data.result !== "success")
      throw new Error("Failed to fetch exchange rate");
    return NextResponse.json({
      success: true,
      rate: data.conversion_rates.EGP,
    });
  } catch (error) {
    console.error("Exchange rate error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch exchange rate" },
      { status: 500 }
    );
  }
}
