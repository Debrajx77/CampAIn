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
  const info = await transporter.sendMail({
    from: `"CampAIn" <${process.env.EMAIL_USER}>`,
    to, // The recipient email
    subject, // Subject of the email
    text, // The body of the email
  });

  try {
    const info = await transporter.sendMail({
      from: `"CampAIn" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};
