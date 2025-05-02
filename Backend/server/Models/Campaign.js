const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  objective: { type: Number, required: true },
  startDate: { type: Date, required: false }, // Optional start date
  endDate: { type: Date, required: false }, // Optional end date
  isActive: { type: Boolean, default: false }, // Campaign status
  clicks: { type: Number, default: 0 }, // Track how many clicks the campaign received
  conversions: { type: Number, default: 0 }, // Track successful conversions
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Campaign", CampaignSchema);
