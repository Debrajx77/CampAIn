const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const campaignRoutes = require("./Routes/Campaigns");
const authRoutes = require("./Routes/auth");
const emailRoutes = require("./Routes/emailRoutes"); // ✅ CommonJS version
const cron = require("node-cron");
const Campaign = require("./Models/Campaign");

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ CORS Setup
const allowedOrigin = "https://camp-a-in.vercel.app"; // Aapka frontend ka domain

app.use(
  cors({
    origin: allowedOrigin, // Allow frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow required methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow headers
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);

// ✅ Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigin, // Same frontend domain for Socket.IO
    methods: ["GET", "POST"],
    credentials: true, // Enable credentials for WebSocket connection
  },
});

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api", campaignRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes); // ✅ Make sure this is CommonJS-compatible

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

//const optimizeCampaign = require("./utils/optimizer");

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    // Step 1: Auto-toggle active/inactive campaigns based on dates
    await Campaign.updateMany(
      { startDate: { $lte: now }, endDate: { $gte: now }, isActive: false },
      { $set: { isActive: true } },
      { timeout: 30000 }
    );

    await Campaign.updateMany(
      { endDate: { $lt: now }, isActive: true },
      { $set: { isActive: false } },
      { timeout: 30000 }
    );

    // Step 2: Optimize campaigns (based on various metrics)
    const campaigns = await Campaign.find({ isActive: true });

    for (const campaign of campaigns) {
      const { updates, insights } = optimizeCampaign(campaign);

      if (Object.keys(updates).length > 0) {
        // Update campaign based on optimizer results
        await Campaign.findByIdAndUpdate(campaign._id, updates);
      }

      // Optionally, log or store the insights for later review
      console.log(`[Auto-Optimize] ${campaign.title}:`, insights);
    }
  } catch (err) {
    console.error(
      "Error updating campaign statuses and optimizing campaigns:",
      err
    );
  }
});

// ✅ WebSocket
let notifications = [];

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

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Something went wrong!" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
