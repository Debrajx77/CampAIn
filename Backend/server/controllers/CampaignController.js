const MasterCampaign = require("../Models/MasterCampaign");
const Channel = require("../Models/Channel");

// Create a new Master Campaign (with A/B Testing support)
const createMasterCampaign = async (req, res) => {
  try {
    const {
      isABTesting = false,
      variants = [],
      name,
      description,
      budget,
      startDate,
      endDate,
      status,
      channels,
    } = req.body;

    // ✅ A/B Testing Mode
    if (isABTesting) {
      if (!Array.isArray(variants) || variants.length < 2) {
        return res
          .status(400)
          .json({ msg: "At least 2 variants required for A/B testing" });
      }

      const masterCampaign = new MasterCampaign({
        name,
        description,
        isABTesting: true,
        variants: [],
        status: "ab_testing",
      });

      await masterCampaign.save();

      for (const variant of variants) {
        const variantChannels = [];

        if (Array.isArray(variant.channels)) {
          for (const ch of variant.channels) {
            const channel = new Channel({
              campaignType: ch.campaignType,
              configuration: ch.configuration,
              status: ch.status || "draft",
              masterCampaign: masterCampaign._id,
            });
            await channel.save();
            variantChannels.push(channel._id);
          }
        }

        masterCampaign.variants.push({
          name: variant.name,
          description: variant.description,
          budget: variant.budget,
          startDate: new Date(variant.startDate),
          endDate: new Date(variant.endDate),
          status: variant.status || "draft",
          channels: variantChannels,
        });
      }

      await masterCampaign.save();
      return res.status(201).json(masterCampaign);
    }

    // ✅ Normal Campaign Mode
    const masterCampaign = new MasterCampaign({
      name,
      description,
      budget,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: status.toLowerCase(),
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
    console.error("Failed to create master campaign:", err);
    res
      .status(500)
      .json({ msg: "Failed to create campaign", error: err.message });
  }
};

// Get all Master Campaigns
const getMasterCampaigns = async (req, res) => {
  try {
    const campaigns = await MasterCampaign.find()
      .populate("channels")
      .populate("variants.channels");
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
    const campaign = await MasterCampaign.findById(req.params.id)
      .populate("channels")
      .populate("variants.channels");
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

// Delete a Master Campaign
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await MasterCampaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (err) {
    console.error("Error deleting campaign:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Legacy Meta Ads logic (if used)
exports.saveMetaAds = async (req, res) => {
  const { campaignId, metaAds } = req.body;
  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    campaign.metaAds = metaAds;
    await campaign.save();

    res.status(200).json({ message: "Meta Ads saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createMasterCampaign,
  getMasterCampaigns,
  getMasterCampaignById,
  addChannelToCampaign,
  deleteCampaign,
};
