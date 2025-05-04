const express = require("express");
const http = require("http"); // Required for Socket.IO
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const campaignRoutes = require("./Routes/Campaigns"); // <-- use Campaigns.js
const authRoutes = require("./Routes/auth");
const cron = require("node-cron");
const Campaign = require("./Models/Campaign");

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"], // Allow both origins
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use("/api", campaignRoutes);
app.use("/api", authRoutes);

// MongoDB connection
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Cron job to update campaign statuses every minute
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    const activated = await Campaign.updateMany(
      { startDate: { $lte: now }, endDate: { $gte: now }, isActive: false },
      { $set: { isActive: true } }
    );

    const deactivated = await Campaign.updateMany(
      { endDate: { $lt: now }, isActive: true },
      { $set: { isActive: false } }
    );
  } catch (err) {
    console.error("Error updating campaign statuses:", err);
  }
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for new comments
  socket.on("newComment", (data) => {
    io.emit("commentAdded", data); // Broadcast the comment to all clients
  });

  // Broadcast a new notification
  socket.on("newNotification", (notification) => {
    notifications.push(notification); // Save to mock database
    io.emit("notification", notification); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT);
