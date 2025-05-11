const express = require("express");
const connectDB = require("./config/db");
const authenticate = require("./middleware/authenticate");

const notificationsRouter = require("./Routes/Notifications");
const organizationRouter = require("./Routes/Organization");
const authRouter = require("./Routes/auth");
const createTeamRouter = require("./Routes/CreateTeam");
const viewTeamRouter = require("./Routes/viewTeam");
const addMembersToTeamRouter = require("./Routes/addMembersToTeam");
const removeMembersFromTeamRouter = require("./Routes/removeMembersFromTeam");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/notifications", notificationsRouter);
app.use("/api/organization", organizationRouter);
app.use("/api/auth", authRouter);
app.use("/api/team/create", createTeamRouter);
app.use("/api/team/view", viewTeamRouter);
app.use("/api/team/add-member", addMembersToTeamRouter);
app.use("/api/team/remove-member", removeMembersFromTeamRouter);

// Default route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server error");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
