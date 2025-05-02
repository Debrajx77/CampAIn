const Campaign = require("../Models/Campaign");

// Create a new campaign
const createCampaign = async (req, res) => {
  const { name, targetAudience, goal, startDate, endDate } = req.body;

  try {
    const newCampaign = new Campaign({
      name,
      targetAudience,
      goal,
      startDate,
      endDate,
    });
    await newCampaign.save();
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all campaigns
const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCampaign, getCampaigns };
