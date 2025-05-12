// addMemberToTeam.js
const express = require("express");
const Team = require("../Models/Team");
const User = require("../Models/user");
const authenticate = require("../middleware/authenticate");
const checkRole = require("../middleware/checkRole");
const { checkTeamMemberLimit } = require("../middleware/checkLimit");

const router = express.Router();

// Add a member to the team
router.post(
  "/team/:teamId/add-member",
  authenticate,
  checkTeamMemberLimit,
  async (req, res) => {
    try {
      const { userId } = req.body;
      const team = await Team.findById(req.params.teamId);
      if (!team) return res.status(404).json({ msg: "Team not found" });

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ msg: "User not found" });

      team.members.push(user._id);
      await team.save();
      res.status(200).json({ msg: "Member added" });
    } catch (err) {
      console.error("Error adding member to team:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

module.exports = router;
