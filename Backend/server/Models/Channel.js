const mongoose = require("mongoose");

const Channel = new mongoose.Schema({
  campaignType: { type: String, required: true }, // Should store 'email', 'google', or 'meta'
  configuration: {
    // Email
    subject: String,
    fromEmail: String,
    replyTo: String,
    emailBody: String,
    audienceType: String, // "existing", "csv", "manual"
    existingList: String, // For existing list
    csvFileUrl: String, // For uploaded CSV
    manualEmails: String,
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

module.exports = mongoose.model("Channel", Channel);
