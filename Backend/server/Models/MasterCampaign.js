const mongoose = require("mongoose");

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
    channels: [
      {
        googleAds: {
          headline: String,
          description: String,
          audience: [String],
          budget: Number,
          startDate: Date,
          endDate: Date,
          status: {
            type: String,
            enum: ["draft", "active", "paused"],
            default: "draft",
          },
          performance: {
            clicks: Number,
            impressions: Number,
            conversions: Number,
            cost: Number,
          },
        },
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MasterCampaign", MasterCampaignSchema);
