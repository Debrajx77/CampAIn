const express = require("express");
const router = express.Router();
const Organization = require("../Models/Organization");
const User = require("../Models/user");
const Team = require("../Models/Team");
const { checkAuth, checkOrg, checkRole } = require("../middleware/orgAuth");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Plan limits
const PLAN_LIMITS = { free: 3, premium: 10 };

// Get organization details
router.get("/", checkAuth, checkOrg, async (req, res) => {
  try {
    const org = req.organization;
    await org.populate({
      path: "members.user",
      select: "name email",
    });
    await org.populate({
      path: "teams",
      populate: {
        path: "members.user",
        select: "name email",
      },
    });
    res.json(org);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Create organization
router.post("/", checkAuth, async (req, res) => {
  try {
    const { name } = req.body;
    const existingOrg = await Organization.findOne({ createdBy: req.user.id });
    if (existingOrg) {
      return res.status(400).json({ msg: "Organization already exists" });
    }
    const org = new Organization({
      name,
      createdBy: req.user.id,
      plan: "free",
      members: [{ user: req.user.id, role: "admin" }],
    });
    await org.save();
    res.status(201).json(org);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Invite member (admin only, check plan limit)
router.post(
  "/invite",
  checkAuth,
  checkOrg,
  checkRole("admin"),
  async (req, res) => {
    try {
      const org = req.organization;
      if (org.members.length >= PLAN_LIMITS[org.plan]) {
        return res
          .status(403)
          .json({ msg: "Member limit reached. Upgrade your plan." });
      }

      const { email, role, teamId } = req.body;

      let user = await User.findOne({ email });
      if (!user) {
        // Optionally, create user or send invite email logic here
        return res.status(404).json({ msg: "User not found" });
      }

      if (org.members.some((m) => m.user.equals(user._id))) {
        return res.status(400).json({ msg: "User already a member" });
      }

      // Add member to organization
      org.members.push({ user: user._id, role });
      await org.save();

      // If teamId provided, add member to that team
      if (teamId) {
        const team = await Team.findOne({
          _id: teamId,
          organizationId: org._id,
        });
        if (team) {
          if (!team.members.some((m) => m.user.equals(user._id))) {
            team.members.push({ user: user._id, role });
            await team.save();
          }
        }
      }

      res
        .status(200)
        .json({ msg: "Member invited and assigned to team if selected" });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Remove member (admin only)
router.delete(
  "/remove-member",
  checkAuth,
  checkOrg,
  checkRole("admin"),
  async (req, res) => {
    try {
      const { userId } = req.body;
      const org = req.organization;

      org.members = org.members.filter((m) => !m.user.equals(userId));
      await org.save();

      // Also remove from all teams
      const teams = await Team.find({ organizationId: org._id });
      for (const team of teams) {
        team.members = team.members.filter((m) => !m.user.equals(userId));
        await team.save();
      }

      res.status(200).json({ msg: "Member removed" });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Change member role (admin only)
router.put(
  "/change-role",
  checkAuth,
  checkOrg,
  checkRole("admin"),
  async (req, res) => {
    try {
      const { userId, role } = req.body;
      const org = req.organization;

      const member = org.members.find((m) => m.user.equals(userId));
      if (!member) {
        return res.status(404).json({ msg: "Member not found" });
      }
      member.role = role;
      await org.save();

      // Also update role in teams where member exists
      const teams = await Team.find({ organizationId: org._id });
      for (const team of teams) {
        const teamMember = team.members.find((m) => m.user.equals(userId));
        if (teamMember) {
          teamMember.role = role;
          await team.save();
        }
      }

      res.status(200).json({ msg: "Role updated" });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

module.exports = router;
