import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create reusable email transport object using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email campaign
export const sendCampaignEmail = async (req, res) => {
  const { to, subject, body } = req.body;

  // Debugging form data
  console.log("Email request received:", req.body);

  if (!to || !subject || !body) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const info = await transporter.sendMail({
      from: `"CampAIn" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: body,
    });

    res
      .status(200)
      .json({ success: true, message: "Email sent successfully", info });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({
        success: false,
        error: "Failed to send email",
        details: error.message,
      });
  }
};
