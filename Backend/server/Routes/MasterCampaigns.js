const express = require("express");
const router = express.Router();
const MasterCampaign = require("../Models/MasterCampaign");
const Channel = require("../Models/Channel");

// Create a new Master Campaign
router.post("/create", async (req, res) => {
  try {
    const { name, description, budget, startDate, endDate, status } = req.body;
    const masterCampaign = new MasterCampaign({
      name,
      description,
      budget,
      startDate,
      endDate,
      status,
    });
    await masterCampaign.save();
    res.status(201).json(masterCampaign);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to create campaign", error: err.message });
  }
});

// Add a new channel to an existing campaign
router.post("/:campaignId/channels", async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { campaignType, configuration, status } = req.body;

    // Create the channel
    const channel = new Channel({
      campaignType,
      configuration,
      status,
      masterCampaign: campaignId,
    });
    await channel.save();

    // Add channel to master campaign
    await MasterCampaign.findByIdAndUpdate(
      campaignId,
      { $push: { channels: channel._id } },
      { new: true }
    );

    res.status(201).json(channel);
  } catch (err) {
    res.status(500).json({ msg: "Failed to add channel", error: err.message });
  }
});

// Get all master campaigns (for campaign list)
router.get("/", async (req, res) => {
  try {
    const campaigns = await MasterCampaign.find();
    res.json(campaigns); // <-- Return as array
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch campaigns", error: err.message });
  }
});

module.exports = router;
