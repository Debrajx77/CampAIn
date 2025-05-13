import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useParams } from "react-router-dom";

// Map channel type to icon and label
const CHANNEL_META = {
  email: {
    icon: <EmailIcon color="primary" fontSize="large" />,
    label: "Email Campaign",
  },
  google: {
    icon: <GoogleIcon sx={{ color: "#4285F4" }} fontSize="large" />,
    label: "Google Ads",
  },
  meta: {
    icon: <FacebookIcon sx={{ color: "#1877F3" }} fontSize="large" />,
    label: "Meta Ads",
  },
};

const dummyChannelDetails = (channel) => {
  switch (channel.type) {
    case "email":
      return (
        <>
          <Typography variant="body2">Subject: {channel.subject}</Typography>
          <Typography variant="body2">Sent: {channel.sent}</Typography>
          <Typography variant="body2">Open Rate: {channel.openRate}</Typography>
        </>
      );
    case "google":
      return (
        <>
          <Typography variant="body2">Clicks: {channel.clicks}</Typography>
          <Typography variant="body2">Budget: ${channel.budget}</Typography>
        </>
      );
    case "meta":
      return (
        <>
          <Typography variant="body2">Reach: {channel.reach}</Typography>
          <Typography variant="body2">CTR: {channel.ctr}</Typography>
        </>
      );
    default:
      return <Typography variant="body2">No details</Typography>;
  }
};

const MasterCampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch campaign data
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await axios.get(`/api/campaigns/${id}`);
        // For demo, if no channels, use dummy data
        if (!res.data.channels || res.data.channels.length === 0) {
          res.data.channels = [
            { type: "email", subject: "50% Off!", sent: 5000, openRate: "45%" },
            { type: "google", clicks: 1200, budget: 400 },
            { type: "meta", reach: 20000, ctr: "3.5%" },
          ];
        }
        setCampaign(res.data);
      } catch (err) {
        setCampaign(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!campaign) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Failed to load campaign.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 4 } }}>
      {/* Master Campaign Overview */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
          background: "#fff",
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={1}>
          {campaign.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mb={2}>
          {campaign.description}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Budget
            </Typography>
            <Typography variant="h6">${campaign.budget}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Duration
            </Typography>
            <Typography variant="h6">
              {campaign.startDate?.slice(0, 10)} -{" "}
              {campaign.endDate?.slice(0, 10)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
              {campaign.status}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Channels Section */}
      <Typography variant="h5" fontWeight={600} mb={2}>
        Channels
      </Typography>
      <Grid container spacing={3}>
        {(campaign.channels || []).map((channel, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 2,
                p: 2,
                minHeight: 220,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  {CHANNEL_META[channel.type]?.icon || <EmailIcon />}
                  <Typography variant="h6" fontWeight={600} ml={1}>
                    {CHANNEL_META[channel.type]?.label || channel.type}
                  </Typography>
                </Box>
                {dummyChannelDetails(channel)}
              </CardContent>
              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <Button variant="outlined" size="small">
                  👁 View Details
                </Button>
                <Button variant="contained" size="small" color="primary">
                  ✏ Edit
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Channel Button */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          Add Channel
        </Button>
      </Box>
    </Box>
  );
};

export default MasterCampaignDetails;
