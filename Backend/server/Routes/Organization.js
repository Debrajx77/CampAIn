const express = require("express");
const router = express.Router();
const Organization = require("../Models/Organization");
const User = require("../Models/user");
const { checkAuth, checkOrg, checkRole } = require("../middleware/orgAuth");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Plan limits
const PLAN_LIMITS = { free: 3, premium: 10 };

// Create organization
router.post("/create", checkAuth, async (req, res) => {
  try {
    const { name, plan } = req.body;
    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: req.user.email,
      name,
    });
    const org = new Organization({
      name,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "admin" }],
      stripeCustomerId: customer.id,
      plan: plan || "free",
    });
    await org.save();
    req.user.organization = org._id;
    await req.user.save();
    res.status(201).json({ org });
  } catch (err) {
    res.status(500).json({ msg: "Error creating organization" });
  }
});

// Get current user's org
router.get("/my-org", checkAuth, async (req, res) => {
  const org = await Organization.findOne({
    "members.user": req.user._id,
  }).populate("members.user", "name email");
  if (!org) return res.status(404).json({ msg: "No organization found" });
  res.json(org);
});

// Invite member (admin only, check plan limit)
router.post(
  "/invite",
  checkAuth,
  checkOrg,
  checkRole("admin"),
  async (req, res) => {
    const org = req.organization;
    if (org.members.length >= PLAN_LIMITS[org.plan]) {
      return res
        .status(403)
        .json({ msg: "Member limit reached. Upgrade your plan." });
    }
    const { email, role } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      // Optionally, create a user or send invite email
      return res.status(404).json({ msg: "User not found" });
    }
    if (org.members.some((m) => m.user.equals(user._id))) {
      return res.status(400).json({ msg: "User already in organization" });
    }
    org.members.push({ user: user._id, role: role || "member" });
    await org.save();
    user.organization = org._id;
    await user.save();
    res.json({ msg: "User added", org });
  }
);

// Change member role (admin only)
router.put(
  "/change-role",
  checkAuth,
  checkOrg,
  checkRole("admin"),
  async (req, res) => {
    const { userId, role } = req.body;
    const org = req.organization;
    const member = org.members.find((m) => m.user.equals(userId));
    if (!member) return res.status(404).json({ msg: "Member not found" });
    member.role = role;
    await org.save();
    res.json({ msg: "Role updated", org });
  }
);

// Remove member (admin only)
router.delete(
  "/remove-member",
  checkAuth,
  checkOrg,
  checkRole("admin"),
  async (req, res) => {
    const { userId } = req.body;
    const org = req.organization;
    org.members = org.members.filter((m) => !m.user.equals(userId));
    await org.save();
    await User.findByIdAndUpdate(userId, { $unset: { organization: "" } });
    res.json({ msg: "Member removed", org });
  }
);

// Get plan limits
router.get("/limits", checkAuth, checkOrg, (req, res) => {
  const org = req.organization;
  res.json({ memberLimit: PLAN_LIMITS[org.plan], plan: org.plan });
});

module.exports = router;
