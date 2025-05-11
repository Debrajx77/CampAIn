import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  IconButton,
  Badge,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Notification from "../Routes/Notifications";

const Dashboard = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const notificationRef = useRef();

  const handleCreateCampaign = () => {
    navigate("/create-campaign");
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(
          "https://campain-b2rr.onrender.com/api/campaigns",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.msg || "Failed to fetch campaigns");
          return;
        }

        setCampaigns(data);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#1e1e2f",
        color: "#fff",
        padding: "2rem",
        paddingTop: "6rem", // Adjust padding top as per navbar height
        position: "relative",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Welcome to CampAIgn
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={toggleNotifications}>
            <Badge
              badgeContent={notifications.filter((n) => !n.read).length || null}
              color="secondary"
            >
              <NotificationsIcon sx={{ color: "#a78bfa" }} />
            </Badge>
          </IconButton>

          <Button
            variant="contained"
            color="error"
            onClick={() => navigate("/")}
            sx={{
              textTransform: "none",
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Notification panel */}
      {showNotifications && (
        <Box
          ref={notificationRef}
          sx={{
            position: "absolute",
            top: "6rem",
            right: "2rem",
            zIndex: 1000,
          }}
        >
          <Notification
            notifications={notifications}
            setNotifications={setNotifications}
          />
        </Box>
      )}

      {/* Action Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "2rem",
        }}
      >
        <Button
          variant="contained"
          onClick={handleCreateCampaign}
          sx={{
            textTransform: "none",
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
          }}
        >
          + Create New Campaign
        </Button>
      </Box>

      {/* Recent Campaigns */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Your Campaigns
      </Typography>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : campaigns.length === 0 ? (
        <Typography>No campaigns found. Create one to get started!</Typography>
      ) : (
        <Grid container spacing={3}>
          {campaigns.map((campaign) => (
            <Grid item xs={12} sm={6} md={4} key={campaign._id}>
              <Card
                sx={{
                  backgroundColor: "#2a2a3b",
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#3a3a4b",
                  },
                }}
                onClick={() => navigate(`/campaign/${campaign._id}`)}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {campaign.campaignName}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    {campaign.description}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    Budget: ${campaign.budget}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;
