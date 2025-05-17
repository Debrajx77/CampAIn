const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const notificationsRouter = require("./Routes/Notifications");
const organizationRouter = require("./Routes/Organization");
const authRouter = require("./Routes/auth");
const createTeamRouter = require("./Routes/CreateTeam");
const viewTeamRouter = require("./Routes/viewTeam");
const addMembersToTeamRouter = require("./Routes/addMembersToTeam");
const removeMembersFromTeamRouter = require("./Routes/removeMembersFromTeam");
const masterCampaignRoutes = require("./Routes/MasterCampaigns");
const mailchimpRouter = require("./Routes/Mailchimp");
const audienceRoutes = require("./Routes/Audience");
// const googleAdsRoutes = require("./Routes/MasterCampaigns/google-ads");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

const cors = require("cors");

app.use(
  cors({
    origin: "https://camp-a-in.vercel.app", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/api/notifications", notificationsRouter);
app.use("/api/organization", organizationRouter);
app.use("/api/auth", authRouter);
app.use("/api/team/create", createTeamRouter);
app.use("/api/team/view", viewTeamRouter);
app.use("/api/team/add-member", addMembersToTeamRouter);
app.use("/api/team/remove-member", removeMembersFromTeamRouter);
app.use("/api/mailchimp", mailchimpRouter); // Mailchimp routes
app.use("/api/audience", audienceRoutes);
app.use("/uploads", express.static("uploads")); // To serve uploaded files
// app.use("/api/MasterCampaigns/google", googleAdsRoutes); // Google Ads routes

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// Only this line for all campaign endpoints:
app.use("/api/MasterCampaigns", masterCampaignRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room ${room}`);
  });

  socket.on("sendMessage", ({ room, message }) => {
    io.to(room).emit("receiveMessage", { message, sender: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server error");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
