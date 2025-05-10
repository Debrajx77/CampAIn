const express = require("express");
const { sendCampaignEmail } = require("../controllers/emailController");

const router = express.Router();

router.post("/send-email", sendCampaignEmail);

module.exports = router;
