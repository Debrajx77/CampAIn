const express = require("express");
const router = express.Router(); // Assuming you have a Campaign model
const MasterCampaign = require("../Models/MasterCampaign");

// GET /api/campaigns - fetch all campaigns from DB
router.get("/", async (req, res) => {
  try {
    const campaigns = await MasterCampaign.find();
    res.json(campaigns);
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
