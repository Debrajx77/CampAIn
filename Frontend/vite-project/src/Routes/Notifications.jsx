import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://campain-2.onrender.com", {
  transports: ["websocket"],
  credentials: true,
});

const Notifications = ({ notifications, setNotifications }) => {
  useEffect(() => {
    fetchNotifications();

    // Real-time notifications
    socket.on("notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, [setNotifications]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("https://campain-2.onrender.com", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch notifications");
        return;
      }

      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAsRead = async () => {
    try {
      await fetch("http://localhost:5000/api/notifications/read", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 max-h-[400px] overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">
          Notifications
        </h3>
        <button
          onClick={markAsRead}
          className="text-sm text-blue-500 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`p-3 rounded-lg ${
                n.read
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-500"
                  : "bg-blue-50 dark:bg-blue-900 text-gray-800 dark:text-gray-200"
              }`}
            >
              <p className="text-sm">{n.message}</p>
              <span className="text-xs text-gray-400">
                {new Date(n.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
