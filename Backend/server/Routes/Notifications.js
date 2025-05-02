const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

// Mock database for notifications
let notifications = [];

// Fetch notifications
router.get("/notifications", authenticate, (req, res) => {
  res.status(200).json(notifications);
});

// Add a new notification (for testing purposes)
router.post("/notifications", authenticate, (req, res) => {
  const { message, type } = req.body;

  if (!message || !type) {
    return res.status(400).json({ msg: "Message and type are required" });
  }

  const notification = {
    id: Date.now(),
    message,
    type,
    read: false,
    timestamp: new Date(),
  };

  notifications.push(notification);
  res.status(201).json(notification);
});

// Mark notifications as read
router.put("/notifications/read", authenticate, (req, res) => {
  notifications = notifications.map((notification) => ({
    ...notification,
    read: true,
  }));
  res.status(200).json({ msg: "All notifications marked as read" });
});

module.exports = router;
