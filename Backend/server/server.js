const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const campaignRoutes = require("./Routes/Campaigns");
const authRoutes = require("./Routes/auth");
const cron = require("node-cron");
const Campaign = require("./Models/Campaign");
const emailRoutes = require("./Routes/emailRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Use only one well-configured CORS setup
const allowedOrigin = "https://camp-a-in.vercel.app";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ Socket.IO instance with proper CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Middleware
app.use(bodyParser.json());
app.use(express.json());

// ✅ Basic test route
app.get("/", (req, res) => {
  res.send("API is running");
});

// ✅ Routes
app.use("/api", campaignRoutes);
app.use("/api", authRoutes);
app.use(require("./Routes/auth"));
app.use("/api/email", emailRoutes);

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Cron job to auto-activate/deactivate campaigns
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    await Campaign.updateMany(
      { startDate: { $lte: now }, endDate: { $gte: now }, isActive: false },
      { $set: { isActive: true } }
    );

    await Campaign.updateMany(
      { endDate: { $lt: now }, isActive: true },
      { $set: { isActive: false } }
    );
  } catch (err) {
    console.error("Error updating campaign statuses:", err);
  }
});

// ✅ WebSocket events
let notifications = []; // mock in-memory store (replace with DB in prod)

io.on("connection", (socket) => {
  console.log("🔌 A user connected");

  socket.on("newComment", (data) => {
    io.emit("commentAdded", data);
  });

  socket.on("newNotification", (notification) => {
    notifications.push(notification);
    io.emit("notification", notification);
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected");
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
