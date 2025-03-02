import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    employment: String,
    location: String,

    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: String,
    avatar: String,
    cover: String,
    socialLinks: [
      {
        site: {
          type: String,
          enum: [
            "github",
            "behance",
            "dribbble",
            "linkedin",
            "instagram",
            "twitter",
            "youtube",
          ],
        },
        url: String,
        icon: String,
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        img: String,
        gallery: [String],
        links: [
          {
            type: {
              type: String,
              enum: [
                "github",
                "live",
                "figma",
                "youtube",
                "instagram",
                "dribbble",
                "behance",
              ],
            },
            url: String,
          },
        ],
      },
    ],
    skills: [
      {
        name: String,
        image: String,
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        location: String,
        startDate: Date,
        endDate: Date,
        description: [String],
      },
    ],
    theme: {
      type: String,
      enum: ["minimal", "modern", "classic"],
      default: "minimal",
    },
    customDomain: String,
    bio: String,
    seoMeta: {
      title: String,
      description: String,
      keywords: [String],
    },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
