const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const authenticate = require("./middleware/authenticate");
const notificationsRouter = require("./Routes/Notifications");
const organizationRouter = require("./Routes/Organization");
const authRouter = require("./Routes/auth");
const createTeamRouter = require("./Routes/CreateTeam");
const viewTeamRouter = require("./Routes/viewTeam");
const addMembersToTeamRouter = require("./Routes/addMembersToTeam");
const removeMembersFromTeamRouter = require("./Routes/removeMembersFromTeam");
const campaignsRouter = require("./Routes/CampaignRoutes");

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
    origin: "https://camp-a-in.vercel.app", // apne frontend ka URL yahan daalo
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // agar cookies/token bhejna hai to
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
app.use("/api/campaigns", campaignsRouter);

// Default route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Example event: join a room
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  // Example event: leave a room
  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room ${room}`);
  });

  // Example event: send message to a room
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
