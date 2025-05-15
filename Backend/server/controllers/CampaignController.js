const MasterCampaign = require("../Models/MasterCampaign");
const Channel = require("../Models/Channel");

// Create a new Master Campaign
const createMasterCampaign = async (req, res) => {
  try {
    const { name, description, budget, startDate, endDate, status, channels } =
      req.body;

    const masterCampaign = new MasterCampaign({
      name,
      description,
      budget,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: status.toLowerCase(),
    });

    await masterCampaign.save();

    // Channels create karo agar bheje gaye hain
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
    console.error("Failed to create master campaign:", err);
    res
      .status(500)
      .json({ msg: "Failed to create campaign", error: err.message });
  }
};

// Get all Master Campaigns
const getMasterCampaigns = async (req, res) => {
  try {
    const campaigns = await MasterCampaign.find().populate("channels");
    res.status(200).json(campaigns);
  } catch (err) {
    console.error("Failed to fetch master campaigns:", err);
    res
      .status(500)
      .json({ msg: "Failed to fetch campaigns", error: err.message });
  }
};

// Get a single Master Campaign by ID with populated channels
const getMasterCampaignById = async (req, res) => {
  try {
    const campaign = await MasterCampaign.findById(req.params.id).populate(
      "channels"
    );
    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }
    res.json(campaign);
  } catch (err) {
    console.error("Failed to fetch master campaign:", err);
    res
      .status(500)
      .json({ msg: "Failed to fetch campaign", error: err.message });
  }
};

// Add a new channel to an existing Master Campaign
const addChannelToCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { campaignType, configuration, status } = req.body;

    const channel = new Channel({
      campaignType,
      configuration,
      status,
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
    console.error("Failed to add channel:", err);
    res.status(500).json({ msg: "Failed to add channel", error: err.message });
  }
};

module.exports = {
  createMasterCampaign,
  getMasterCampaigns,
  getMasterCampaignById,
  addChannelToCampaign,
};
