const mongoose = require("mongoose");

const BillingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stripeCustomerId: { type: String, required: true },
  subscriptionId: { type: String },
  plan: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
  status: {
    type: String,
    enum: ["active", "past_due", "canceled", "unpaid", "free"],
    default: "free",
  },
  currentPeriodEnd: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Billing", BillingSchema);
