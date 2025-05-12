const mongoose = require("mongoose");

const EmailLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  // Optionally, you can add campaignId, recipients, etc.
});

module.exports = mongoose.model("EmailLog", EmailLogSchema);
