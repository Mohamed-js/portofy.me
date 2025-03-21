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
    descriptionTitle: String,
    description: String,
    email: String,
    phone: String,
    cover: String, // Cover image URL
    avatar: String, // Override user's avatar if needed

    // SOCIAL LINKS
    socialLinksTitle: {
      type: String,
      default: "Let's connect",
    },
    socialLinks: [
      {
        site: {
          type: String,
          enum: [
            "whatsapp",
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

    // PROJECTS
    projectsActivatedInResume: { type: Boolean, default: true },
    projectsActivatedInPortfolio: { type: Boolean, default: true },
    projectsTitle: {
      type: String,
      default: "Check out my Projects",
    },
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

    // SKILLS
    skillsActivatedInResume: { type: Boolean, default: true },
    skillsActivatedInPortfolio: { type: Boolean, default: true },
    skillsTitle: {
      type: String,
      default: "Skills I Master",
    },
    skills: [
      {
        name: String,
        image: String,
      },
    ],

    // EXPERIENCE
    experienceActivatedInResume: { type: Boolean, default: true },
    experienceActivatedInPortfolio: { type: Boolean, default: true },
    experienceTitle: {
      type: String,
      default: "My work experience",
    },
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
      enum: ["minimal", "flames", "modern"],
      default: "minimal",
    },
    font: {
      type: String,
      enum: [
        "openSans",
        "poppins",
        "robotoSlab",
        "roboto",
        "almarai",
        "changa",
        "tajawal",
        "merriweatherSans",
        "cairo",
        "lato",
      ],
      default: "openSans",
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
      enum: ["portfolio", "social-links", "custom"], // For future expansion
      default: "social-links",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Portfolio ||
  mongoose.model("Portfolio", PortfolioSchema);
