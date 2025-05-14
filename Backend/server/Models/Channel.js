const mongoose = require("mongoose");

const Channel = new mongoose.Schema({
  campaignType: { type: String, required: true }, // Should store 'email', 'google', or 'meta'
  configuration: {
    // Email specific
    subject: String,
    sent: Number,
    openRate: String,
    // Google specific
    clicks: Number,
    budgetUsed: Number,
    ctr: String,
    // Meta specific
    reach: Number,
    impressions: Number,
  },
  status: { type: String, default: "draft" },
  masterCampaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MasterCampaign",
  },
});
