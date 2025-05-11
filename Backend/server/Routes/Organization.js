const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorizeRole = require("../middleware/authorizeRole");
const Organization = require("../Models/Organization");
const User = require("../Models/user");

// Create an organization (admin only)
router.post(
  "/organization",
  authenticate,
  authorizeRole("admin"),
  async (req, res) => {
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
  }
);

// Get organization details
router.get("/organization", authenticate, async (req, res) => {
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
  "/organization/:orgId/add-member",
  authenticate,
  authorizeRole("admin"),
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

// Create an organization
router.post(
  "/create-organization",
  authenticate,
  checkRole("admin"),
  async (req, res) => {
    const { name } = req.body;
    const newOrganization = new Organization({ name });
    await newOrganization.save();
    res
      .status(201)
      .json({ msg: "Organization created", organization: newOrganization });
  }
);

// Fetch all organizations
router.get(
  "/organizations",
  authenticate,
  checkRole("admin"),
  async (req, res) => {
    const organizations = await Organization.find();
    res.json(organizations);
  }
);
module.exports = router;
