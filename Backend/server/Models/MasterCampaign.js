const mongoose = require("mongoose");

// Google Ads Audience Schema
const GoogleAdsAudienceSchema = new mongoose.Schema(
  {
    demographics: {
      ageRange: [String],
      gender: [String],
      parentalStatus: [String],
    },
    locationTargeting: {
      country: String,
      cityOrRegion: String,
      radiusKm: Number,
    },
    languages: [String],
    interests: [String],
    inMarketSegments: [String],
    customAudience: {
      keywords: [String],
      urls: [String],
      apps: [String],
    },
    deviceTargeting: [String],
    remarketing: [String],
  },
  { _id: false }
);

// Meta Ads Schema
const MetaAdsSchema = new mongoose.Schema(
  {
    audienceType: String,
    existingList: String,
    manualAudience: {
      age: [String],
      gender: [String],
      location: String,
      interests: [String],
      behaviors: [String],
      device: [String],
    },
  },
  { _id: false }
);

// Email Marketing Schema
const EmailSchema = new mongoose.Schema(
  {
    subject: String,
    fromEmail: String,
    replyTo: String,
    emailBody: String,
    audienceType: String,
    manualEmails: String,
    csvFile: String,
    existingList: String,
  },
  { _id: false }
);

// Individual Channel Schema
const CampaignSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    campaignName: { type: String, required: true },
    status: { type: String, default: "draft" },
    master: { type: Boolean, default: true },

    // Per-channel configuration
    googleAds: GoogleAdsAudienceSchema,
    email: EmailSchema,
    metaAds: MetaAdsSchema,

    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// Master Campaign Schema
const MasterCampaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["draft", "active", "completed"],
      default: "draft",
    },
    channels: [CampaignSchema], // Inline subdocs for each ad channel (Google, Meta, Email)
  },
  { timestamps: true }
);

module.exports = mongoose.model("MasterCampaign", MasterCampaignSchema);
