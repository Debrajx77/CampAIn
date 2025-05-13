const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    objective: { type: Number, required: true },
    startDate: { type: Date, default: null }, // Optional start date with default null
    endDate: { type: Date, default: null }, // Optional end date with default null
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
    mailchimpCampaignId: { type: String },
    deliveryStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    openRate: { type: Number, default: 0 },
    clickRate: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("Campaign", CampaignSchema);
