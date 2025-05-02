const transporter = require("../utils/email"); // Import the configured transporter

/**
 * Send a welcome email to the user
 * @param {string} userEmail - The recipient's email address
 * @param {string} userName - The recipient's name
 */
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    await transporter.sendMail({
      from: '"CampAin" <your-email@gmail.com>', // Replace with your sender email
      to: userEmail, // Recipient email
      subject: "Welcome to CampAin!", // Email subject
      template: "welcome", // Template name (matches the .hbs file in the templates folder)
      context: {
        name: userName, // Dynamic data for the template
      },
    });
    console.log("Welcome email sent successfully!");
  } catch (err) {
    console.error("Error sending welcome email:", err.message);
  }
};

module.exports = { sendWelcomeEmail };
