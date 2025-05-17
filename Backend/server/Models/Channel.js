const mongoose = require("mongoose");

const Channel = new mongoose.Schema({
  campaignType: { type: String, required: true }, // email, google, meta, linkedin, whatsapp
  configuration: {
    // Email
    subject: String,
    fromEmail: String,
    replyTo: String,
    emailBody: String,
    audienceType: String, // "existing", "csv", "manual"
    existingList: String,
    csvFileUrl: String,
    manualEmails: String,

    // Google
    clicks: { type: Number, default: 0 },
    budgetUsed: { type: Number, default: 0 },
    ctr: { type: String, default: "0%" },

    // Meta
    reach: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },

    // LinkedIn
    jobTitles: [String],
    industries: [String],
    location: String,
    age: [String],
    gender: [String],

    // WhatsApp
    senderName: String,
    templateMessage: String,
    manualNumbers: String,
  },
  status: { type: String, default: "draft" },
  masterCampaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MasterCampaign",
  },
});

module.exports = mongoose.model("Channel", Channel);
