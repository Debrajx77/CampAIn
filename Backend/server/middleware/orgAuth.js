const Organization = require("../Models/Organization");

// Attach user from JWT (replace with your real auth logic)
const checkAuth = (req, res, next) => {
  // If using passport/jwt, req.user should already be set
  if (!req.user) return res.status(401).json({ msg: "Unauthorized" });
  next();
};

// Attach org to req if user is a member
const checkOrg = async (req, res, next) => {
  const org = await Organization.findOne({ "members.user": req.user._id });
  if (!org) return res.status(403).json({ msg: "No organization" });
  req.organization = org;
  next();
};

// Allow only admins
const checkRole = (role) => (req, res, next) => {
  const member = req.organization.members.find((m) =>
    m.user.equals(req.user._id)
  );
  if (!member || member.role !== role)
    return res.status(403).json({ msg: "Forbidden" });
  next();
};

module.exports = { checkAuth, checkOrg, checkRole };
