// removeMemberFromTeam.js
const express = require("express");
const Team = require("../Models/Team");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Remove a member from the team
router.put("/:teamId/remove-member", authenticate, async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the team by teamId
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }

    // Check if the user is part of the team
    if (!team.members.includes(userId)) {
      return res.status(404).json({ msg: "User is not part of the team" });
    }

    // Remove the user from the team
    team.members = team.members.filter(
      (member) => member.toString() !== userId
    );
    await team.save();

    res.status(200).json({ msg: "Member removed from team" });
  } catch (err) {
    console.error("Error removing member from team:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
