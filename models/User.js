// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    phone: String,
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: String,
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    stripeCustomerId: String,
    paypalSubscriptionId: String,
    billingPeriod: {
      type: String,
      enum: ["monthly", "annual", null],
      default: null,
    },
    subscriptionEnd: {
      type: Date,
      default: null,
    },
    storageUsed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
