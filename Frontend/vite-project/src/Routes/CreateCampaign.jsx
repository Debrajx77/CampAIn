import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  CardActionArea,
  Button,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import axios from "axios";

// Channel definitions for easy extension
const CHANNELS = [
  {
    key: "email",
    title: "Email Campaign",
    icon: <EmailIcon fontSize="large" color="primary" />,
  },
  {
    key: "google",
    title: "Google Ads",
    icon: <GoogleIcon fontSize="large" sx={{ color: "#4285F4" }} />,
  },
  {
    key: "meta",
    title: "Meta Ads",
    icon: <FacebookIcon fontSize="large" sx={{ color: "#1877F3" }} />,
  },
  {
    key: "linkedin",
    title: "LinkedIn Ads",
    icon: <LinkedInIcon fontSize="large" sx={{ color: "#0A66C2" }} />,
  },
  {
    key: "whatsapp",
    title: "WhatsApp Broadcast",
    icon: <WhatsAppIcon fontSize="large" sx={{ color: "#25D366" }} />,
  },
];

const STEPS = [
  "Master Campaign",
  "Configure Channels",
  "Channel Setup",
  "Review & Launch",
];

const API_URL = "https://campain-b2rr.onrender.com/api/campaigns";

function CreateCampaignPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // Step management
  const [step, setStep] = useState(0);
  // Master Campaign State
  const [masterCampaign, setMasterCampaign] = useState({
    name: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
    status: "Draft",
  });
  // Channel selection and configuration
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [channelConfigs, setChannelConfigs] = useState({});
  // Channel currently being configured
  const [activeChannel, setActiveChannel] = useState(null);

  // Snackbar state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Handlers
  const handleMasterChange = (e) => {
    setMasterCampaign({ ...masterCampaign, [e.target.name]: e.target.value });
  };

  const handleChannelSelect = (key) => {
    setSelectedChannels((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedChannels.length > 0) {
      setActiveChannel(selectedChannels[0]);
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 2 && activeChannel) {
      const idx = selectedChannels.indexOf(activeChannel);
      if (idx > 0) {
        setActiveChannel(selectedChannels[idx - 1]);
        return;
      }
    }
    setStep((s) => s - 1);
  };

  const handleChannelConfigChange = (channelKey, config) => {
    setChannelConfigs((prev) => ({
      ...prev,
      [channelKey]: { ...prev[channelKey], ...config },
    }));
  };

  const handleChannelConfigNext = () => {
    const idx = selectedChannels.indexOf(activeChannel);
    if (idx < selectedChannels.length - 1) {
      setActiveChannel(selectedChannels[idx + 1]);
    } else {
      setActiveChannel(null);
      setStep(3); // Move to Review
    }
  };

  // Toast handlers
  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToast({ ...toast, open: false });
  };

  // API call to create campaign
  const handleActivateCampaign = async () => {
    try {
      const payload = {
        name: masterCampaign.name,
        description: masterCampaign.description,
        budget: Number(masterCampaign.budget),
        startDate: masterCampaign.startDate,
        endDate: masterCampaign.endDate,
        status: masterCampaign.status.toLowerCase(),
      };

      const response = await axios.post(`${API_URL}/create`, payload);

      setToast({
        open: true,
        message: "Campaign created successfully!",
        severity: "success",
      });

      console.log("Campaign created:", response.data);
    } catch (error) {
      console.error("Failed to create campaign:", error);
      setToast({
        open: true,
        message: "Failed to create campaign",
        severity: "error",
      });
    }
  };

  // Channel Config Forms (modular, easy to extend)
  const ChannelConfigForm = ({ channelKey }) => {
    switch (channelKey) {
      case "email":
        return (
          <Box>
            <Typography variant="h6" mb={2}>
              Email Campaign Setup
            </Typography>
            <TextField
              label="Subject"
              fullWidth
              margin="normal"
              value={channelConfigs.email?.subject || ""}
              onChange={(e) =>
                handleChannelConfigChange("email", { subject: e.target.value })
              }
            />
            <TextField
              label="Template"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={channelConfigs.email?.template || ""}
              onChange={(e) =>
                handleChannelConfigChange("email", { template: e.target.value })
              }
            />
            <TextField
              label="Recipients"
              fullWidth
              margin="normal"
              value={channelConfigs.email?.recipients || ""}
              onChange={(e) =>
                handleChannelConfigChange("email", {
                  recipients: e.target.value,
                })
              }
              helperText="Comma separated emails"
            />
          </Box>
        );
      case "google":
        return (
          <Box>
            <Typography variant="h6" mb={2}>
              Google Ads Setup
            </Typography>
            <TextField
              label="Ad Title"
              fullWidth
              margin="normal"
              value={channelConfigs.google?.adTitle || ""}
              onChange={(e) =>
                handleChannelConfigChange("google", { adTitle: e.target.value })
              }
            />
            <TextField
              label="Keywords"
              fullWidth
              margin="normal"
              value={channelConfigs.google?.keywords || ""}
              onChange={(e) =>
                handleChannelConfigChange("google", {
                  keywords: e.target.value,
                })
              }
              helperText="Comma separated"
            />
            <TextField
              label="Budget"
              fullWidth
              margin="normal"
              type="number"
              value={channelConfigs.google?.budget || ""}
              onChange={(e) =>
                handleChannelConfigChange("google", { budget: e.target.value })
              }
            />
          </Box>
        );
      case "meta":
        return (
          <Box>
            <Typography variant="h6" mb={2}>
              Meta Ads Setup
            </Typography>
            <TextField
              label="Audience"
              fullWidth
              margin="normal"
              value={channelConfigs.meta?.audience || ""}
              onChange={(e) =>
                handleChannelConfigChange("meta", { audience: e.target.value })
              }
            />
            <TextField
              label="Budget"
              fullWidth
              margin="normal"
              type="number"
              value={channelConfigs.meta?.budget || ""}
              onChange={(e) =>
                handleChannelConfigChange("meta", { budget: e.target.value })
              }
            />
          </Box>
        );
      default:
        return null;
    }
  };

  // Review Section
  const ReviewSection = () => (
    <Box>
      <Typography variant="h6" mb={2}>
        Review & Launch
      </Typography>
      <Typography fontWeight={600}>Master Campaign</Typography>
      <Typography>Name: {masterCampaign.name}</Typography>
      <Typography>Description: {masterCampaign.description}</Typography>
      <Typography>
        Budget: {masterCampaign.budget} | Status: {masterCampaign.status}
      </Typography>
      <Typography>
        Duration: {masterCampaign.startDate} to {masterCampaign.endDate}
      </Typography>
      <Box mt={2}>
        <Typography fontWeight={600}>Channels</Typography>
        {selectedChannels.map((key) => (
          <Box key={key} mb={1}>
            <Typography>
              {CHANNELS.find((c) => c.key === key)?.title}:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {JSON.stringify(channelConfigs[key], null, 2)}
            </Typography>
          </Box>
        ))}
      </Box>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleActivateCampaign}
      >
        Activate Campaign
      </Button>
    </Box>
  );

  // Main Render
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: theme.palette.background.default,
        py: 6,
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Stepper
        activeStep={step}
        alternativeLabel
        sx={{ mb: 4, width: "100%", maxWidth: 800 }}
      >
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {/* Step 1: Master Campaign */}
      {step === 0 && (
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            background: theme.palette.background.paper,
            boxShadow: 2,
            minWidth: isMobile ? "90vw" : 400,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight={600} mb={2}>
            Create Master Campaign
          </Typography>
          <TextField
            label="Campaign Name"
            name="name"
            value={masterCampaign.name}
            onChange={handleMasterChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={masterCampaign.description}
            onChange={handleMasterChange}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            label="Budget"
            name="budget"
            value={masterCampaign.budget}
            onChange={handleMasterChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            label="Start Date"
            name="startDate"
            value={masterCampaign.startDate}
            onChange={handleMasterChange}
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            name="endDate"
            value={masterCampaign.endDate}
            onChange={handleMasterChange}
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Status"
            name="status"
            value={masterCampaign.status}
            onChange={handleMasterChange}
            fullWidth
            margin="normal"
            select
          >
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="active">Active</MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleNext}
            disabled={
              !masterCampaign.name ||
              !masterCampaign.startDate ||
              !masterCampaign.endDate
            }
          >
            Next: Configure Channels
          </Button>
        </Box>
      )}
      {/* Step 2: Configure Channels */}
      {step === 1 && (
        <Box sx={{ width: "100%", maxWidth: 900 }}>
          <Typography variant="h5" fontWeight={600} mb={2} align="center">
            Select Channels to Configure
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {CHANNELS.map((type) => (
              <Grid item xs={12} sm={6} md={4} key={type.key}>
                <Card
                  elevation={selectedChannels.includes(type.key) ? 8 : 2}
                  sx={{
                    borderRadius: 3,
                    border: selectedChannels.includes(type.key)
                      ? `2px solid ${theme.palette.primary.main}`
                      : "2px solid transparent",
                    transition: "box-shadow 0.2s, border 0.2s",
                    background: selectedChannels.includes(type.key)
                      ? theme.palette.action.selected
                      : theme.palette.background.paper,
                  }}
                >
                  <CardActionArea onClick={() => handleChannelSelect(type.key)}>
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        py: isMobile ? 3 : 5,
                      }}
                    >
                      {type.icon}
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        mt={2}
                        mb={1}
                        align="center"
                      >
                        {type.title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button onClick={handleBack}>Back</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={selectedChannels.length === 0}
            >
              Next: Channel Setup
            </Button>
          </Box>
        </Box>
      )}
      {/* Step 3: Channel Configuration */}
      {step === 2 && activeChannel && (
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            background: theme.palette.background.paper,
            boxShadow: 2,
            minWidth: isMobile ? "90vw" : 400,
            textAlign: "center",
          }}
        >
          {ChannelConfigForm({ channelKey: activeChannel })}
          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button onClick={handleBack}>Back</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleChannelConfigNext}
            >
              {selectedChannels.indexOf(activeChannel) ===
              selectedChannels.length - 1
                ? "Review & Launch"
                : "Next Channel"}
            </Button>
          </Box>
        </Box>
      )}
      {/* Step 4: Review & Launch */}
      {step === 3 && <ReviewSection />}

      {/* Snackbar for notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CreateCampaignPage;
