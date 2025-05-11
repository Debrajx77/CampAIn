const express = require("express");
const router = express.Router();
const { sendWelcomeEmail } = require("../controllers/emailController");

router.post("/send", async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ msg: "Missing fields" });
  }

  try {
    await sendWelcomeEmail(email, name);
    res.json({ msg: "Email sent successfully" });
  } catch (err) {
    console.error("Email send error:", err.message);
    res.status(500).json({ msg: "Failed to send email" });
  }
});

module.exports = router;
