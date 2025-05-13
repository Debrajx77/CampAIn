const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema(
  {
    campaignType: {
      type: String,
      enum: ["email", "google_ads", "meta_ads"],
      required: true,
    },
    configuration: {
      type: mongoose.Schema.Types.Mixed, // Flexible for channel-specific configs
      default: {},
    },
    status: {
      type: String,
      enum: ["draft", "active", "completed"],
      default: "draft",
    },
    masterCampaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterCampaign",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Channel", ChannelSchema);