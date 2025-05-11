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
app.use(
  cors({
    origin: "https://camp-a-in.vercel.app", // Aapka frontend ka domain
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow DELETE method
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,
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

// ✅ Cron job for campaign auto-toggle
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

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
  } catch (err) {
    console.error("Error updating campaign statuses:", err);
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
