const mongoose = require("mongoose");

const Channel = new mongoose.Schema({
  campaignType: { type: String, required: true }, // Should store 'email', 'google', or 'meta'
  configuration: {
    // Email
    subject: { type: String, default: "" },
    sent: { type: Number, default: 0 },
    openRate: { type: String, default: "0%" },
    // Google
    clicks: { type: Number, default: 0 },
    budgetUsed: { type: Number, default: 0 },
    ctr: { type: String, default: "0%" },
    // Meta
    reach: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
  },
  status: { type: String, default: "draft" },
  masterCampaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MasterCampaign",
  },
});
