const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authenticate");
const {
  sendMailchimpCampaign,
  getMailchimpPerformance,
} = require("../controllers/MailchimpController");

// Use controller functions directly
router.post("/send-campaign", authenticate, sendMailchimpCampaign);
router.get("/performance/:campaignId", authenticate, getMailchimpPerformance);

module.exports = router;
