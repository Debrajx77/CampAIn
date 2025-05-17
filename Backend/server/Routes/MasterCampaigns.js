const express = require("express");
const router = express.Router();
const MasterCampaign = require("../Models/MasterCampaign");
const Channel = require("../Models/Channel");
const protect = require("../middleware/protect");

// Create a new Master Campaign
router.post("/create", async (req, res) => {
  try {
    const { name, description, budget, startDate, endDate, status, channels } =
      req.body;

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

// Add a channel to an existing campaign
router.post("/:campaignId/channels", async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { campaignType, configuration, status } = req.body;

    const channel = new Channel({
      campaignType,
      configuration,
      status: status ? status.toLowerCase() : "draft",
      masterCampaign: campaignId,
    });
    await channel.save();

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

// Get all master campaigns
router.get("/", async (req, res) => {
  try {
    const campaigns = await MasterCampaign.find().populate("channels");
    res.json(campaigns);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch campaigns", error: err.message });
  }
});

// Get a single campaign with channel details
router.get("/:id", async (req, res) => {
  try {
    const campaign = await MasterCampaign.findById(req.params.id).populate({
      path: "channels",
      select: "campaignType configuration status",
    });

    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

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

// Google Ads legacy update route
router.post("/:id/google-ads", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      "channels.googleAds": req.body,
    };

    const updated = await MasterCampaign.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Save Google Ads (modern way)
router.post("/save-google-ads", protect, async (req, res) => {
  const { campaignId, googleAds } = req.body;
  try {
    const campaign = await MasterCampaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    campaign.googleAds = googleAds;
    await campaign.save();

    res.json({ message: "Google Ads config saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Save Meta Ads configuration
router.post("/save-meta-ads", protect, async (req, res) => {
  const { campaignId, metaAds } = req.body;
  try {
    const campaign = await MasterCampaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    campaign.metaAds = metaAds;
    await campaign.save();

    res.json({ message: "Meta Ads config saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Save LinkedIn Ads
router.post("/save-linkedin-ads", protect, async (req, res) => {
  const { campaignId, linkedInAds } = req.body;

  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    campaign.linkedInAds = linkedInAds;
    await campaign.save();

    res.json({ message: "LinkedIn Ads config saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
