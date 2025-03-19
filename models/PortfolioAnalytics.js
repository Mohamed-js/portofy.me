// models/PortfolioAnalytics.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["page_view", "scroll_depth", "click"],
    required: true,
  },
  value: { type: String },
  timestamp: { type: Date, default: Date.now },
  device: { type: String },
  referrer: { type: String },
  screenWidth: { type: Number },
  userAgent: { type: String },
  ip: { type: String },
});

const portfolioAnalyticsSchema = new mongoose.Schema(
  {
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
    },
    events: [eventSchema],
  },
  { timestamps: true }
);

export default mongoose.models.PortfolioAnalytics ||
  mongoose.model("PortfolioAnalytics", portfolioAnalyticsSchema);
