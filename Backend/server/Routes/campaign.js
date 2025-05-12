const express = require("express");
const router = express.Router();
const Campaign = require("../Models/Campaign"); // Assuming Campaign model exists

// GET /api/campaign/:id/comments - fetch comments for a campaign
router.get("/:id/comments", async (req, res) => {
  try {
    const campaignId = req.params.id;
    const campaign = await Campaign.findById(campaignId).populate("comments");
    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }
    res.json(campaign.comments || []);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
