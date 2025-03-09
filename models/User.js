import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    employment: String,
    location: String,
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: String,
    avatar: String,
    cover: String,
    socialLinks: [
      {
        site: {
          type: String,
          enum: [
            "github",
            "gitlab",
            "bitbucket",
            "behance",
            "dribbble",
            "linkedin",
            "instagram",
            "twitter",
            "youtube",
            "vimeo",
            "tiktok",
            "twitch",
            "medium",
            "devto",
            "stackoverflow",
            "facebook",
            "pinterest",
            "soundcloud",
            "spotify",
            "patreon",
            "website",
            "",
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
    bio: String,
    seoMeta: {
      title: { type: String, default: "John Doe | Software Engineer" },
      description: {
        type: String,
        default: "A showcase of my work that I've done before...",
      },
      keywords: { type: [String], default: [] },
    },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
