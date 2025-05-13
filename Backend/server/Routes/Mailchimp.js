const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middleware/authenticate");
const {
  sendMailchimpCampaign,
  getMailchimpPerformance,
} = require("../controllers/MailchimpController");

// Use controller functions directly
router.post("/send-campaign", checkAuth, sendMailchimpCampaign);
router.get("/performance/:campaignId", checkAuth, getMailchimpPerformance);

module.exports = router;
