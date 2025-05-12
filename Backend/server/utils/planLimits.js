const planLimits = {
  free: {
    maxCampaigns: 3,
    maxTeamMembers: 2,
    aiOptimization: false,
    emailLimit: 500,
  },
  pro: {
    maxCampaigns: 20,
    maxTeamMembers: 5,
    aiOptimization: true,
    emailLimit: 5000,
  },
  enterprise: {
    maxCampaigns: Infinity,
    maxTeamMembers: 50,
    aiOptimization: true,
    emailLimit: 50000,
  },
};

module.exports = planLimits;
