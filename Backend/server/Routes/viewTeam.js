// viewTeam.js
const express = require("express");
const Team = require("../Models/Team");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Get team details
router.get("/", authenticate, async (req, res) => {
  try {
    const team = await Team.findOne({ createdBy: req.user.id }).populate(
      "members",
      "name email"
    );
    if (!team) return res.status(404).json({ msg: "Team not found" });
    res.json(team);
  } catch (err) {
    console.error("Error fetching team:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
