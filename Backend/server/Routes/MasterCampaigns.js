const express = require("express");
const router = express.Router();
const MasterCampaign = require("../Models/MasterCampaign");
const Channel = require("../Models/Channel");

// Create a new Master Campaign (Draft or Active)
router.post("/create", async (req, res) => {
  try {
    const { name, description, budget, startDate, endDate, status, channels } =
      req.body;
    // Ensure required fields are present
    if (!name || !description || !budget || !startDate || !endDate) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const masterCampaign = new MasterCampaign({
      name,
      description,
      budget,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: status ? status.toLowerCase() : "draft",
    });
    await masterCampaign.save();

    // If channels are provided, create them and link to campaign
    if (Array.isArray(channels) && channels.length > 0) {
      for (const ch of channels) {
        const channel = new Channel({
          campaignType: ch.campaignType,
          configuration: ch.configuration,
          status: ch.status || "draft",
          masterCampaign: masterCampaign._id,
        });
        await channel.save();
        masterCampaign.channels.push(channel._id);
      }
      await masterCampaign.save();
    }

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
      status: status ? status.toLowerCase() : "draft",
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
    // Populate channels for list if you want to show channel info in list
    const campaigns = await MasterCampaign.find().populate("channels");
    res.json(campaigns);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch campaigns", error: err.message });
  }
});

// Get a single campaign by ID with populated channels
router.get("/:id", async (req, res) => {
  try {
    const campaign = await MasterCampaign.findById(req.params.id).populate({
      path: "channels",
      select: "campaignType configuration status",
    });

    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    // Transform data for frontend compatibility
    const transformedCampaign = {
      ...campaign.toObject(),
      budget: campaign.budget.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
      status:
        campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1),
      channels: campaign.channels.map((channel) => ({
        type: channel.campaignType,
        ...channel.configuration,
        id: channel._id,
      })),
    };

    res.json(transformedCampaign);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch campaign", error: err.message });
  }
});

module.exports = router;
