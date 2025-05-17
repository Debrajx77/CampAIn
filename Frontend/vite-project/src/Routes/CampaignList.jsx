import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Button,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(
        "https://campain-b2rr.onrender.com/api/campaigns"
      );
      setCampaigns(Array.isArray(res.data) ? res.data : []);
    } catch (_err) {
      setError("Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this campaign?"
    );
    if (!confirm) return;

    try {
      await axios.delete(
        `https://campain-b2rr.onrender.com/api/campaigns/${id}`
      );
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Failed to delete campaign");
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Master Campaigns
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/create-campaign")}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          New Campaign
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : campaigns.length === 0 ? (
        <Typography>No campaigns found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {campaigns.map((campaign) => (
            <Grid item xs={12} sm={6} md={4} key={campaign._id}>
              <Card
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  borderRadius: 3,
                  boxShadow: 3,
                  background: "#1e1e1e",
                  color: "#fff",
                  "&:hover": { boxShadow: 8, background: "#23234a" },
                  minHeight: 180,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {/* Delete Button */}
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "#f44336",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(campaign._id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>

                <CardContent
                  onClick={() => navigate(`/campaign/${campaign._id}`)}
                >
                  <Typography variant="h6" fontWeight={600} mb={1}>
                    {campaign.name}
                  </Typography>
                  <Typography variant="body2" color="gray" mb={1}>
                    {campaign.description}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    Budget: ${campaign.budget}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    Status: {campaign.status}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    Duration: {campaign.startDate?.slice(0, 10)} -{" "}
                    {campaign.endDate?.slice(0, 10)}
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

export default CampaignList;
