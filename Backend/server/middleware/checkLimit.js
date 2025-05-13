const planLimits = require("../utils/planLimits");
const Campaign = require("../Models/MasterCampaign");
const Team = require("../Models/Team");
const EmailLog = require("../Models/EmailLog"); // You need to create this model

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

const checkTeamMemberLimit = async (req, res, next) => {
  try {
    const plan = req.user.subscription || "free";
    const { maxTeamMembers } = planLimits[plan] || planLimits.free;

    // Count team members for the user's organization
    const team = await Team.findOne({
      organizationId: req.user.organizationId,
    });
    const memberCount = team ? team.members.length : 0;

    if (memberCount >= maxTeamMembers) {
      return res.status(403).json({
        msg: `Team member limit reached for your plan (${maxTeamMembers}). Upgrade to invite more.`,
      });
    }
    next();
  } catch (err) {
    console.error("Error checking team member limit:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

const checkEmailLimit = async (req, res, next) => {
  try {
    const plan = req.user.subscription || "free";
    const { maxEmailsPerMonth } = planLimits[plan] || planLimits.free;

    // Count emails sent this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const sentCount = await EmailLog.countDocuments({
      user: req.user.id,
      sentAt: { $gte: startOfMonth },
    });

    if (sentCount >= maxEmailsPerMonth) {
      return res.status(403).json({
        msg: `Email send limit reached for your plan (${maxEmailsPerMonth}/month). Upgrade to send more.`,
      });
    }
    next();
  } catch (err) {
    console.error("Error checking email limit:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { checkCampaignLimit, checkTeamMemberLimit, checkEmailLimit };
