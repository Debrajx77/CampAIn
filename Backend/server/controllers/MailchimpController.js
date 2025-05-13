const mailchimp = require("@mailchimp/mailchimp_marketing");
const Campaign = require("../Models/MasterCampaign");

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX, // e.g. "us2"
});

// Create, send Mailchimp campaign and update MongoDB
const sendMailchimpCampaign = async (req, res) => {
  try {
    const { campaignId, subject, content, listId, fromName, replyTo } =
      req.body;

    // 1. Create Mailchimp campaign
    const mcCampaign = await mailchimp.campaigns.create({
      type: "regular",
      recipients: { list_id: listId },
      settings: {
        subject_line: subject,
        title: subject,
        from_name: fromName,
        reply_to: replyTo,
      },
    });

    // 2. Set campaign content
    await mailchimp.campaigns.setContent(mcCampaign.id, { html: content });

    // 3. Send campaign
    await mailchimp.campaigns.send(mcCampaign.id);

    // 4. Update campaign in MongoDB
    const updated = await Campaign.findByIdAndUpdate(
      campaignId,
      {
        mailchimpCampaignId: mcCampaign.id,
        deliveryStatus: "sent",
      },
      { new: true }
    );

    res.json({
      success: true,
      mailchimpCampaignId: mcCampaign.id,
      campaign: updated,
    });
  } catch (err) {
    console.error("Mailchimp error:", err.response?.body || err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Fetch Mailchimp campaign performance and update MongoDB
const getMailchimpPerformance = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.campaignId);
    if (!campaign || !campaign.mailchimpCampaignId)
      return res.status(404).json({ msg: "No Mailchimp campaign found" });

    const report = await mailchimp.reports.get(campaign.mailchimpCampaignId);

    // Update in DB
    campaign.openRate = report.opens?.open_rate || 0;
    campaign.clickRate = report.clicks?.click_rate || 0;
    campaign.bounceRate = report.bounces?.hard_bounces || 0;
    await campaign.save();

    res.json({
      openRate: campaign.openRate,
      clickRate: campaign.clickRate,
      bounceRate: campaign.bounceRate,
      report,
    });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch performance", error: err.message });
  }
};

console.log("sendMailchimpCampaign:", sendMailchimpCampaign);
console.log("getMailchimpPerformance:", getMailchimpPerformance);

module.exports = {
  sendMailchimpCampaign,
  getMailchimpPerformance,
};
