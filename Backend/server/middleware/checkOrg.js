const Organization = require("../Models/Organization");
const User = require("../Models/user");

// Attach user from JWT (example, use your existing logic)
const checkAuth = (req, res, next) => {
  // ...decode JWT, set req.user...
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
