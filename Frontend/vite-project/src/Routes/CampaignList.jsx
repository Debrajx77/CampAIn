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
  Snackbar,
  Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
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

  const confirmDelete = (id) => {
    setDeleteId(id);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://campain-b2rr.onrender.com/api/campaigns/${deleteId}`
      );

      if (response.status === 200) {
        setCampaigns((prev) => prev.filter((c) => c._id !== deleteId));
        setSnackbarOpen(true);
      } else {
        throw new Error("Failed to delete campaign");
      }
    } catch (err) {
      console.error("Error deleting campaign:", err);
      if (err.response?.status === 404) {
        alert("Campaign not found. It may have been already deleted.");
        // Remove the campaign from the local state if it's not found on the server
        setCampaigns((prev) => prev.filter((c) => c._id !== deleteId));
      } else {
        alert("Failed to delete campaign. Please try again.");
      }
    } finally {
      setOpenModal(false);
      setDeleteId(null);
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
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "#f44336",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(campaign._id);
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

      {/* Centered Modal for Delete Confirmation */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography id="modal-title" variant="h6" fontWeight={600} mb={2}>
            Confirm Delete
          </Typography>
          <Typography id="modal-description" mb={3}>
            Are you sure you want to delete this campaign?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <Button onClick={() => setOpenModal(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar after deletion */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Campaign deleted successfully"
      />
    </Box>
  );
};

export default CampaignList;
