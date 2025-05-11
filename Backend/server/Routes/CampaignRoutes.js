const express = require("express");
const router = express.Router();
const Campaign = require("../Models/Campaign"); // Assuming you have a Campaign model

// GET /api/campaigns - fetch all campaigns from DB
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
