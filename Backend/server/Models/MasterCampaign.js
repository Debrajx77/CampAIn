const mongoose = require("mongoose");

// Define GoogleAdsAudienceSchema
const GoogleAdsAudienceSchema = new mongoose.Schema({
  demographics: {
    ageRange: [String], // e.g., ['18-24', '25-34']
    gender: [String], // e.g., ['male', 'female']
    parentalStatus: [String], // e.g., ['parent', 'not_parent']
  },
  locationTargeting: {
    country: String,
    cityOrRegion: String,
    radiusKm: Number,
  },
  languages: [String], // e.g., ['en', 'hi']
  interests: [String], // Affinity audiences
  inMarketSegments: [String],
  customAudience: {
    keywords: [String],
    urls: [String],
    apps: [String],
  },
  deviceTargeting: [String], // ['desktop', 'mobile']
  remarketing: [String], // e.g., ['past_visitors', 'abandoned_forms']
});

// Define EmailSchema
const EmailSchema = new mongoose.Schema({
  subject: String,
  fromEmail: String,
  replyTo: String,
  emailBody: String,
  audienceType: String,
  manualEmails: String,
  csvFile: String,
  existingList: String,
});

// Define CampaignSchema
const CampaignSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  campaignName: { type: String, required: true },
  status: { type: String, default: "draft" },
  master: { type: Boolean, default: true },

  // Save config data for each channel separately
  googleAds: GoogleAdsAudienceSchema,
  email: EmailSchema,
  facebookAds: mongoose.Schema.Types.Mixed, // Optional if not implemented yet

  createdAt: { type: Date, default: Date.now },
});

// Update MasterCampaignSchema to use CampaignSchema
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
    channels: [CampaignSchema], // Use CampaignSchema for channels
  },
  { timestamps: true }
);

module.exports = mongoose.model("MasterCampaign", MasterCampaignSchema);
