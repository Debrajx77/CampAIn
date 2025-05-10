const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const campaignRoutes = require("./Routes/Campaigns");
const authRoutes = require("./Routes/auth");
const emailRoutes = require("./Routes/emailRoutes");
const cron = require("node-cron");
const Campaign = require("./Models/Campaign");

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ CORS Setup (use environment variable for flexibility)
const allowedOrigin = process.env.CORS_ORIGIN || "https://camp-a-in.vercel.app";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ Socket.IO Setup with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Middleware
app.use(express.json()); // Using express.json() for JSON parsing (bodyParser is not needed)

app.get("/", (req, res) => {
  res.send("API is running");
});

// ✅ Routes
app.use("/api", campaignRoutes);
app.use("/api", authRoutes);
app.use("/api/email", emailRoutes);

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Cron job to auto-activate/deactivate campaigns every minute (change schedule for production)
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    // Activate campaigns that are active within the current time window
    await Campaign.updateMany(
      { startDate: { $lte: now }, endDate: { $gte: now }, isActive: false },
      { $set: { isActive: true } }
    );

    // Deactivate campaigns that have passed their end date
    await Campaign.updateMany(
      { endDate: { $lt: now }, isActive: true },
      { $set: { isActive: false } }
    );
  } catch (err) {
    console.error("Error updating campaign statuses:", err);
  }
});

// ✅ WebSocket events for real-time notifications
let notifications = []; // mock in-memory store (replace with DB in production)

io.on("connection", (socket) => {
  console.log("🔌 A user connected");

  // Emit comment addition
  socket.on("newComment", (data) => {
    io.emit("commentAdded", data);
  });

  // Emit new notification
  socket.on("newNotification", (notification) => {
    notifications.push(notification);
    io.emit("notification", notification);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("❌ A user disconnected");
  });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Something went wrong!" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
