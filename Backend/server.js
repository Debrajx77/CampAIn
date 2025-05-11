const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const authenticate = require("./middleware/authenticate");
const notificationsRouter = require("./Routes/Notifications");
const organizationRouter = require("./Routes/Organization");
const authRouter = require("./Routes/auth");
const createTeamRouter = require("./Routes/createTeam");
const viewTeamRouter = require("./Routes/viewTeam");
const addMembersToTeamRouter = require("./Routes/addMembersToTeam");
const removeMembersFromTeamRouter = require("./Routes/removeMembersFromTeam");
const campaignsRouter = require("./Routes/CampaignRoutes");
const campaignRouter = require("./Routes/campaign");
const billingRouter = require("./Routes/billing");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

connectDB();

app.use(express.json());

// Use billing router before raw parser for webhook
app.use("/api/billing", billingRouter);

// Other routes
app.use("/api/notifications", notificationsRouter);
app.use("/api/organization", organizationRouter);
app.use("/api/auth", authRouter);
app.use("/api/team/create", createTeamRouter);
app.use("/api/team/view", viewTeamRouter);
app.use("/api/team/add-member", addMembersToTeamRouter);
app.use("/api/team/remove-member", removeMembersFromTeamRouter);
app.use("/api/campaigns", campaignsRouter);
app.use("/api/campaign", campaignRouter);

// Stripe webhook raw body parser override for webhook route
app.post(
  "/api/billing/webhook",
  express.raw({ type: "application/json" }),
  billingRouter
);

app.get("/", (req, res) => {
  res.send("API is running");
});

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server error");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
