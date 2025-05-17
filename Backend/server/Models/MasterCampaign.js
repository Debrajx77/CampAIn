const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema(
  {
    campaignType: { type: String, required: true }, // e.g., 'googleAds', 'metaAds'
    configuration: { type: mongoose.Schema.Types.Mixed }, // Flexible config
    status: { type: String, default: "draft" },
    masterCampaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterCampaign",
    },
  },
  { timestamps: true }
);

const MasterCampaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    budget: Number,
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ["draft", "active", "completed"],
      default: "draft",
    },
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
  },
  { timestamps: true }
);

const MasterCampaign = mongoose.model("MasterCampaign", MasterCampaignSchema);
const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = { MasterCampaign, Channel };
