import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true, // e.g., "john-portfolio1"
      trim: true,
      index: true,
    },
    title: String, // e.g., "John's Developer Portfolio"
    subTitle: String, // e.g., "Software Engineer"
    description: String,
    cover: String, // Cover image URL
    avatar: String, // Override user's avatar if needed
    socialLinks: [
      {
        site: {
          type: String,
          enum: [
            "github",
            "behance",
            "facebook",
            "linkedin",
            "dribbble",
            "instagram",
            "twitter",
            "gitlab",
            "bitbucket",
            "youtube",
            "vimeo",
            "tiktok",
            "twitch",
            "medium",
            "devto",
            "stackoverflow",
            "pinterest",
            "soundcloud",
            "spotify",
            "patreon",
            "website",
            "other",
            "",
          ],
        },
        url: String,
        icon: String, // URL to an image
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
                "gitlab",
                "bitbucket",
                "live",
                "figma",
                "adobexd",
                "sketch",
                "youtube",
                "vimeo",
                "dribbble",
                "behance",
                "instagram",
                "codepen",
                "codesandbox",
                "replit",
                "playstore",
                "appstore",
                "download",
                "website",
                "",
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
        isPresent: { type: Boolean, default: false },
        description: [String],
      },
    ],
    theme: {
      type: String,
      enum: ["minimal", "modern", "classic"],
      default: "minimal",
    },
    customDomain: String,
    domainVerified: { type: Boolean, default: false },
    seoMeta: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      keywords: { type: [String], default: [] },
    },
    type: {
      type: String,
      enum: ["portfolio", "link-in-bio", "custom"], // For future expansion
      default: "portfolio",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Portfolio ||
  mongoose.model("Portfolio", PortfolioSchema);
