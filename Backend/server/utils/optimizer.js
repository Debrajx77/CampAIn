const optimizeCampaign = (campaign) => {
  const updates = {};
  const insights = [];

  // Budget usage
  const budgetUsed = campaign.spent / campaign.objective;
  if (budgetUsed >= 0.9) {
    insights.push(
      "High budget usage — consider increasing or optimizing spend."
    );
  }

  // CTR (Click-through rate)
  const ctr = campaign.impressions
    ? (campaign.clicks / campaign.impressions) * 100
    : 0;
  if (ctr < 1.5) {
    insights.push("Low CTR — test better headlines or targeting.");
  }

  // Conversion rate
  const conversionRate = campaign.clicks
    ? (campaign.conversions / campaign.clicks) * 100
    : 0;
  if (conversionRate < 5) {
    insights.push("Low conversion rate — optimize landing page or CTA.");
  }

  // Auto-toggle if spent 100% or expired
  if (
    campaign.spent >= campaign.objective ||
    new Date() > new Date(campaign.endDate)
  ) {
    updates.isActive = false;
    insights.push("Campaign paused due to budget exhaustion or end date.");
  }

  return { updates, insights };
};

module.exports = optimizeCampaign;
