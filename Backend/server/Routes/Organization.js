const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const checkRole = require("../middleware/checkRole");
const Organization = require("../Models/Organization");
const User = require("../Models/user");

// Create an organization (admin only)
router.post("/", authenticate, checkRole("admin"), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ msg: "Organization name is required" });

    const newOrganization = new Organization({
      name,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    await newOrganization.save();
    res
      .status(201)
      .json({ msg: "Organization created", organization: newOrganization });
  } catch (err) {
    console.error("Error creating organization:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get organization details for current user
router.get("/", authenticate, async (req, res) => {
  try {
    const organization = await Organization.findOne({ members: req.user.id });
    if (!organization)
      return res.status(404).json({ msg: "Organization not found" });

    res.json(organization);
  } catch (err) {
    console.error("Error fetching organization:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Add a member to the organization (admin only)
router.put(
  "/:orgId/add-member",
  authenticate,
  checkRole("admin"),
  async (req, res) => {
    try {
      const organization = await Organization.findById(req.params.orgId);
      if (!organization)
        return res.status(404).json({ msg: "Organization not found" });

      const user = await User.findById(req.body.userId);
      if (!user) return res.status(404).json({ msg: "User not found" });

      organization.members.push(user._id);
      await organization.save();
      res.status(200).json({ msg: "User added to organization", organization });
    } catch (err) {
      console.error("Error adding member to organization:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Fetch all organizations (admin only)
router.get("/all", authenticate, checkRole("admin"), async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.json(organizations);
  } catch (err) {
    console.error("Error fetching organizations:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
