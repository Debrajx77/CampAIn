const express = require("express");
const router = express.Router();
const MasterCampaign = require("../Models/MasterCampaign");
const Channel = require("../Models/Channel");
const protect = require("../middleware/protect");

// Create a new Master Campaign with channels
router.post("/create", protect, async (req, res) => {
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

    // Save campaign first
    await masterCampaign.save();

    // Save channels if provided
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

// Add a new channel to existing campaign
router.post("/:campaignId/channels", protect, async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { campaignType, configuration, status } = req.body;

    if (!campaignType || !configuration) {
      return res
        .status(400)
        .json({ msg: "campaignType and configuration are required" });
    }

    const channel = new Channel({
      campaignType,
      configuration,
      status: status ? status.toLowerCase() : "draft",
      masterCampaign: campaignId,
    });
    await channel.save();

    await MasterCampaign.findByIdAndUpdate(campaignId, {
      $push: { channels: channel._id },
    });

    res.status(201).json(channel);
  } catch (err) {
    res.status(500).json({ msg: "Failed to add channel", error: err.message });
  }
});

// Update a specific channel by ID
router.put("/channels/:channelId", protect, async (req, res) => {
  try {
    const { channelId } = req.params;
    const { configuration, status } = req.body;

    const updatedChannel = await Channel.findByIdAndUpdate(
      channelId,
      { configuration, status: status ? status.toLowerCase() : undefined },
      { new: true }
    );

    if (!updatedChannel) {
      return res.status(404).json({ msg: "Channel not found" });
    }

    res.json(updatedChannel);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to update channel", error: err.message });
  }
});

// Get all master campaigns with channels populated
router.get("/", protect, async (req, res) => {
  try {
    const campaigns = await MasterCampaign.find().populate("channels");
    res.json(campaigns);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch campaigns", error: err.message });
  }
});

// Get single campaign with channel details
router.get("/:id", protect, async (req, res) => {
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
        id: channel._id,
        type: channel.campaignType,
        configuration: channel.configuration,
        status: channel.status,
      })),
    };

    res.json(transformedCampaign);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch campaign", error: err.message });
  }
});

// Delete a channel by ID
router.delete("/channels/:channelId", protect, async (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ msg: "Channel not found" });

    // Remove reference from master campaign
    await MasterCampaign.findByIdAndUpdate(channel.masterCampaign, {
      $pull: { channels: channelId },
    });

    await channel.remove();

    res.json({ msg: "Channel deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to delete channel", error: err.message });
  }
});

module.exports = router;
