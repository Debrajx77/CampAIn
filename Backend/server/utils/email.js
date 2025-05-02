const nodemailer = require("nodemailer");
const path = require("path");

(async () => {
  const hbs = await import("nodemailer-express-handlebars");

  // Configure the transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Configure handlebars for email templates
  transporter.use(
    "compile",
    hbs.default({
      viewEngine: {
        extname: ".hbs",
        partialsDir: path.resolve("./templates"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./templates"),
      extName: ".hbs",
    })
  );

  const sendWelcomeEmail = async (userEmail, userName) => {
    try {
      await transporter.sendMail({
        from: '"CampAin" <your-email@gmail.com>', // Sender address
        to: userEmail, // Recipient email
        subject: "Welcome to CampAin!", // Email subject
        template: "welcome", // Template name (matches the .hbs file)
        context: {
          name: userName, // Dynamic data for the template
        },
      });
      console.log("Welcome email sent successfully!");
    } catch (err) {
      console.error("Error sending welcome email:", err);
    }
  };

  module.exports = { transporter, sendWelcomeEmail };
})();
