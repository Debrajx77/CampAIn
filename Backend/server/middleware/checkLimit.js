const planLimits = require("../utils/planLimits");
const Campaign = require("../Models/Campaign");

const checkCampaignLimit = async (req, res, next) => {
  try {
    const plan = req.user.subscription || "free";
    const { maxCampaigns } = planLimits[plan] || planLimits.free;

    // Count campaigns for this user (or organization, adjust as needed)
    const campaignCount = await Campaign.countDocuments({
      user: req.user.id,
      organizationId: req.user.organizationId,
    });

    if (campaignCount >= maxCampaigns) {
      return res.status(403).json({
        msg: `Campaign limit reached for your plan (${maxCampaigns}). Upgrade to create more.`,
      });
    }
    next();
  } catch (err) {
    console.error("Error checking campaign limit:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { checkCampaignLimit };
