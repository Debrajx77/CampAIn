import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import axios from "axios";
import { useParams } from "react-router-dom";

const CHANNEL_META = {
  email: {
    icon: <EmailIcon fontSize="large" sx={{ color: "#D44638" }} />,
    label: "Email Campaign",
  },
  google: {
    icon: <GoogleIcon fontSize="large" sx={{ color: "#4285F4" }} />,
    label: "Google Ads",
  },
  meta: {
    icon: <FacebookIcon fontSize="large" sx={{ color: "#1877F2" }} />,
    label: "Meta Ads",
  },
};

const ChannelCard = ({ channel }) => {
  const meta = CHANNEL_META[channel.type] || {};

  const renderChannelDetails = () => {
    switch (channel.type) {
      case "email":
        return (
          <>
            <Typography variant="body2">Subject: {channel.subject}</Typography>
            <Typography variant="body2">Sent: {channel.sent}</Typography>
            <Typography variant="body2">
              Open Rate: {channel.openRate}
            </Typography>
          </>
        );
      case "google":
        return (
          <>
            <Typography variant="body2">Clicks: {channel.clicks}</Typography>
            <Typography variant="body2">
              Budget Used: ${channel.budgetUsed}
            </Typography>
            <Typography variant="body2">CTR: {channel.ctr}</Typography>
          </>
        );
      case "meta":
        return (
          <>
            <Typography variant="body2">Reach: {channel.reach}</Typography>
            <Typography variant="body2">
              Budget Used: ${channel.budgetUsed}
            </Typography>
            <Typography variant="body2">
              Impressions: {channel.impressions}
            </Typography>
          </>
        );
      default:
        return <Typography variant="body2">No details available</Typography>;
    }
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {meta.icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {meta.label}
          </Typography>
        </Box>
        {renderChannelDetails()}
      </CardContent>
      <Divider />
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" size="small">
          View Details
        </Button>
        <Button variant="contained" size="small">
          Edit
        </Button>
      </Box>
    </Card>
  );
};

const MasterCampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await axios.get(`/api/campaigns/${id}`);
        setCampaign(response.data);
      } catch (err) {
        setError("Failed to fetch campaign details. Please try again later.");
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!campaign) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Campaign not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {campaign.name}
        </Typography>
        <Typography variant="body1" paragraph>
          {campaign.description}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">Status</Typography>
            <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
              {campaign.status}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">Budget</Typography>
            <Typography variant="body1">${campaign.budget}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">Start Date</Typography>
            <Typography variant="body1">
              {new Date(campaign.startDate).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">End Date</Typography>
            <Typography variant="body1">
              {new Date(campaign.endDate).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Channels
      </Typography>
      <Grid container spacing={3}>
        {campaign.channels.map((channel, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ChannelCard channel={channel} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MasterCampaignDetails;
