const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const Campaign = require("../Models/Campaign");
const Comment = require("../Models/Comment"); // Ensure this exists
const transporter = require("../utils/email");
const Comment = require("./Models/Comment");

// Fetch all campaigns with optional search
router.get("/campaigns", authenticate, async (req, res) => {
  try {
    const search = req.query.search || "";
    const campaigns = await Campaign.find({
      title: { $regex: search, $options: "i" },
    }).sort({ createdAt: -1 });

    res.json(campaigns);
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Create a new campaign
router.post("/create-campaign", authenticate, async (req, res) => {
  try {
    const { title, description, objective, startDate, endDate } = req.body;
    if (!title || !description || !objective) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newCampaign = new Campaign({
      user: req.user.id,
      title,
      description,
      objective,
      startDate,
      endDate,
    });

    await newCampaign.save();
    res.status(201).json({ msg: "Campaign created", campaign: newCampaign });
  } catch (err) {
    console.error("Error creating campaign:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete a campaign
router.delete("/campaign/:id", authenticate, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });
    if (campaign.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    await campaign.deleteOne();
    res.json({ msg: "Campaign removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// Campaign analytics update
router.post("/campaign/:id/analytics", authenticate, async (req, res) => {
  try {
    const { type } = req.body;
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    if (type === "click") campaign.clicks += 1;
    else if (type === "conversion") campaign.conversions += 1;
    else return res.status(400).json({ msg: "Invalid analytics type" });

    await campaign.save();
    res.status(200).json({ msg: "Analytics updated", campaign });
  } catch (err) {
    console.error("Error updating analytics:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Campaign analytics fetch
router.get("/campaigns/analytics", authenticate, async (req, res) => {
  try {
    const campaigns = await Campaign.find(
      {},
      "title clicks conversions objective startDate endDate"
    );

    const analytics = campaigns.map((c) => ({
      title: c.title,
      clicks: c.clicks,
      conversions: c.conversions,
      budget: c.objective,
      startDate: c.startDate,
      endDate: c.endDate,
    }));

    res.status(200).json(analytics);
  } catch (err) {
    console.error("Error fetching campaign analytics:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Add comment
router.post("/campaign/:id/comment", authenticate, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: "Comment text is required" });

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    campaign.comments.push({ user: req.user.id, text });
    await campaign.save();

    res.status(201).json({ msg: "Comment added", comments: campaign.comments });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Fetch comments
// Fetch comments
router.get("/campaign/:id/comments", authenticate, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    const comments = await Comment.find({ campaign: req.params.id }).populate(
      "user",
      "name _id"
    ); // Populate user details if necessary

    res.status(200).json({ comments });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete comment
router.delete(
  "/campaign/:campaignId/comment/:commentId",
  authenticate,
  async (req, res) => {
    try {
      const { campaignId, commentId } = req.params;
      const comment = await Comment.findById(commentId);
      if (!comment || comment.campaign.toString() !== campaignId) {
        return res.status(404).json({ msg: "Comment not found" });
      }
      if (comment.user.toString() !== req.user.id) {
        return res.status(403).json({ msg: "Not authorized" });
      }

      await comment.remove();
      res.json({ msg: "Comment deleted" });
    } catch (err) {
      console.error("Error deleting comment:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Send email campaign
router.post("/campaign/:id/email", authenticate, async (req, res) => {
  try {
    const { recipients, subject, message } = req.body;
    if (!recipients || !subject || !message) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const emailPromises = recipients.map((email) =>
      transporter.sendMail({
        from: '"CampAin" <your-email@gmail.com>',
        to: email,
        subject,
        html: `<p>${message}</p>`,
      })
    );

    await Promise.all(emailPromises);
    res.status(200).json({ msg: "Email campaign sent successfully!" });
  } catch (err) {
    console.error("Error sending email campaign:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// Fetch calendar data
router.get("/campaigns/calendar", authenticate, async (req, res) => {
  try {
    const campaigns = await Campaign.find({}, "title startDate endDate");
    const calendarData = campaigns.map((c) => ({
      title: c.title,
      start: c.startDate,
      end: c.endDate,
    }));
    res.status(200).json(calendarData);
  } catch (err) {
    console.error("Error fetching calendar data:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Fetch budget info
router.get("/campaigns/budgets", authenticate, async (req, res) => {
  try {
    const campaigns = await Campaign.find({}, "title objective spent");
    const budgets = campaigns.map((c) => ({
      title: c.title,
      budget: c.objective,
      spent: c.spent,
      remaining: c.objective - c.spent,
    }));
    res.status(200).json(budgets);
  } catch (err) {
    console.error("Error fetching campaign budgets:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Update spending
router.put("/campaign/:id/budget", authenticate, async (req, res) => {
  try {
    const { spent } = req.body;
    if (spent == null) {
      return res.status(400).json({ msg: "Spent amount is required" });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    campaign.spent += spent;
    if (campaign.spent > campaign.objective) {
      return res.status(400).json({ msg: "Budget exceeded" });
    }

    await campaign.save();
    res.status(200).json({ msg: "Budget updated", campaign });
  } catch (err) {
    console.error("Error updating budget:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// AI optimization logic
const analyzeCampaign = (campaign) => {
  const insights = [];

  if (campaign.spent / campaign.objective > 0.8) {
    insights.push("Your budget is almost exhausted. Consider increasing it.");
  }

  const ctr = campaign.impressions
    ? (campaign.clicks / campaign.impressions) * 100
    : 0;
  if (ctr < 2) {
    insights.push("CTR is low. Try improving ad content or targeting.");
  }

  const conversionRate = campaign.clicks
    ? (campaign.conversions / campaign.clicks) * 100
    : 0;
  if (conversionRate < 5) {
    insights.push(
      "Low conversion rate. Consider optimizing your landing page."
    );
  }

  return insights;
};

// Get AI insights
router.get("/campaigns/:id/optimize", authenticate, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    const insights = analyzeCampaign(campaign);
    res.status(200).json({ insights });
  } catch (err) {
    console.error("Error analyzing campaign:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
