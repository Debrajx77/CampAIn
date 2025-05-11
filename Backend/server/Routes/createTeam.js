// createTeam.js
const express = require("express");
const Team = require("../models/Team");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Create a new team
router.post("/", authenticate, async (req, res) => {
  try {
    const { name } = req.body;
    const team = new Team({ name, createdBy: req.user.id });
    await team.save();
    res.status(201).json(team);
  } catch (err) {
    console.error("Error creating team:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
