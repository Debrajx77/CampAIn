const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate"); // Ensure authenticate middleware is used
const Campaign = require("../Models/Campaign"); // Assuming you have a Campaign model
const mongoose = require("mongoose");
const transporter = require("../utils/email"); // Import the configured transporter

// Fetch all campaigns for a specific user
router.get("/campaigns", authenticate, async (req, res) => {
  try {
    const search = req.query.search || "";
    const campaigns = await Campaign.find({
      title: { $regex: search, $options: "i" }, // Case-insensitive search
    }).sort({ createdAt: -1 });

    res.json(campaigns);
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE a campaign
router.delete("/campaign/:id", authenticate, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    if (campaign.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await campaign.deleteOne();
    res.json({ msg: "Campaign removed" });
  } catch (err) {
    console.error(err.message);
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

// Update campaign analytics (clicks, conversions)
router.post("/campaign/:id/analytics", authenticate, async (req, res) => {
  try {
    const { type } = req.body; // type can be "click" or "conversion"
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    // Update analytics based on the type
    if (type === "click") {
      campaign.clicks += 1;
    } else if (type === "conversion") {
      campaign.conversions += 1;
    } else {
      return res.status(400).json({ msg: "Invalid analytics type" });
    }

    await campaign.save();
    res.status(200).json({ msg: "Analytics updated", campaign });
  } catch (err) {
    console.error("Error updating analytics:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Fetch campaign analytics
router.get("/campaigns/analytics", authenticate, async (req, res) => {
  try {
    const campaigns = await Campaign.find(
      {},
      "title clicks conversions objective startDate endDate"
    );

    const analytics = campaigns.map((campaign) => ({
      title: campaign.title,
      clicks: campaign.clicks,
      conversions: campaign.conversions,
      budget: campaign.objective,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
    }));

    res.status(200).json(analytics);
  } catch (err) {
    console.error("Error fetching campaign analytics:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Add a comment to a campaign
router.post("/campaign/:id/comment", authenticate, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ msg: "Comment text is required" });
    }

    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    const comment = {
      user: req.user.id,
      text,
    };

    campaign.comments.push(comment);
    await campaign.save();

    res.status(201).json({ msg: "Comment added", comments: campaign.comments });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Fetch comments for a specific campaign
router.get("/campaign/:id/comments", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid campaign ID" });
    }

    const campaign = await Campaign.findById(id).populate(
      "comments.user",
      "name email"
    );

    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    res.status(200).json({ comments: campaign.comments });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE /api/campaign/:campaignId/comment/:commentId
router.delete(
  "/campaign/:campaignId/comment/:commentId",
  authMiddleware,
  async (req, res) => {
    const { campaignId, commentId } = req.params;
    const userId = req.user.id;

    try {
      const comment = await Comment.findById(commentId);
      if (!comment || comment.campaign.toString() !== campaignId) {
        return res.status(404).json({ msg: "Comment not found" });
      }

      if (comment.user.toString() !== userId) {
        return res
          .status(403)
          .json({ msg: "Not authorized to delete this comment" });
      }

      await comment.remove();
      return res.json({ msg: "Comment deleted" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Server error" });
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

    // Send email to all recipients
    const emailPromises = recipients.map((recipient) =>
      transporter.sendMail({
        from: '"CampAin" <your-email@gmail.com>', // Replace with your sender email
        to: recipient, // Recipient email
        subject, // Email subject
        html: `<p>${message}</p>`, // Email content
      })
    );

    await Promise.all(emailPromises);

    res.status(200).json({ msg: "Email campaign sent successfully!" });
  } catch (err) {
    console.error("Error sending email campaign:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// Fetch campaign dates for the calendar
router.get("/campaigns/calendar", authenticate, async (req, res) => {
  try {
    const campaigns = await Campaign.find({}, "title startDate endDate");

    const calendarData = campaigns.map((campaign) => ({
      title: campaign.title,
      start: campaign.startDate,
      end: campaign.endDate,
    }));

    res.status(200).json(calendarData);
  } catch (err) {
    console.error("Error fetching campaign calendar data:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Fetch campaign budgets
router.get("/campaigns/budgets", authenticate, async (req, res) => {
  try {
    const campaigns = await Campaign.find({}, "title objective spent");

    const budgets = campaigns.map((campaign) => ({
      title: campaign.title,
      budget: campaign.objective,
      spent: campaign.spent,
      remaining: campaign.objective - campaign.spent,
    }));

    res.status(200).json(budgets);
  } catch (err) {
    console.error("Error fetching campaign budgets:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Update campaign spending
router.put("/campaign/:id/budget", authenticate, async (req, res) => {
  try {
    const { spent } = req.body;

    if (spent == null) {
      return res.status(400).json({ msg: "Spent amount is required" });
    }

    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    campaign.spent += spent;

    if (campaign.spent > campaign.objective) {
      return res.status(400).json({ msg: "Budget exceeded" });
    }

    await campaign.save();

    res.status(200).json({ msg: "Budget updated successfully", campaign });
  } catch (err) {
    console.error("Error updating campaign budget:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Mock AI Analysis Function
const analyzeCampaign = (campaign) => {
  const insights = [];

  // Example: Budget Utilization
  if (campaign.spent / campaign.objective > 0.8) {
    insights.push("Your budget is almost exhausted. Consider increasing it.");
  }

  // Example: Click-Through Rate (CTR)
  const ctr = (campaign.clicks / campaign.impressions) * 100;
  if (ctr < 2) {
    insights.push(
      "Your click-through rate is low. Consider improving your ad content."
    );
  }

  // Example: Conversion Rate
  const conversionRate = (campaign.conversions / campaign.clicks) * 100;
  if (conversionRate < 5) {
    insights.push(
      "Your conversion rate is low. Consider optimizing your landing page."
    );
  }

  return insights;
};

// AI Analysis API
router.get("/campaigns/:id/optimize", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    const insights = analyzeCampaign(campaign);

    res.status(200).json({ insights });
  } catch (err) {
    console.error("Error analyzing campaign:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Export the router
module.exports = router;
