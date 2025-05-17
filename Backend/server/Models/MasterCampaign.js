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

const LinkedInAdsSchema = new mongoose.Schema(
  {
    headline: String,
    description: String,
    audienceType: String,
    existingList: String,
    manualAudience: {
      age: [String],
      gender: [String],
      location: String,
      industries: [String],
      jobTitles: [String],
    },
  },
  { _id: false }
);

const WhatsAppSchema = new mongoose.Schema(
  {
    message: String,
    audienceType: String,
    existingList: String,
    manualAudience: {
      phoneNumbers: String,
      tags: String,
    },
  },
  { _id: false }
);

// Individual Channel Schema (used inside MasterCampaign.channels[] and variants[].channels[])
const CampaignSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    campaignName: { type: String, required: true },
    status: { type: String, default: "draft" },
    master: { type: Boolean, default: true },
    googleAds: GoogleAdsAudienceSchema,
    email: EmailSchema,
    metaAds: MetaAdsSchema,
    linkedInAds: LinkedInAdsSchema,
    whatsapp: WhatsAppSchema,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// A/B Variant Schema
const VariantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    budget: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ["draft", "active", "completed"],
      default: "draft",
    },
    channels: [CampaignSchema],
  },
  { _id: false }
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
      enum: ["draft", "active", "completed", "ab_testing"],
      default: "draft",
    },
    isABTesting: { type: Boolean, default: false },
    channels: [CampaignSchema], // For normal campaign
    variants: [VariantSchema], // For A/B testing mode
  },
  { timestamps: true }
);

module.exports = mongoose.model("MasterCampaign", MasterCampaignSchema);
