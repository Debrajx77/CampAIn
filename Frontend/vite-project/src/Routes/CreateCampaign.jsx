import React, { useState, Suspense } from "react";
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
  CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import axios from "axios";

const EmailSection = React.lazy(() => import("./EmailSection"));
import GoogleAdsForm from "./GoogleAdsForm";
import MetaAdsForm from "./MetaAdsForm";
import LinkedInAdsForm from "./LinkedInAdsForm";
import WhatsappForm from "./WhatsappForm";
import ReviewAndLaunch from "./ReviewAndLaunch";
import CampaignForm from "./CampaignForm";
import { motion, AnimatePresence } from "framer-motion";
import { Collapse, Grow } from "@mui/material";
import { Switch, FormControlLabel } from "@mui/material";
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

const ChannelConfigForm = ({
  channelKey,
  channelConfigs,
  handleChannelConfigChange,
}) => {
  switch (channelKey) {
    case "email":
      return (
        <Suspense fallback={<CircularProgress />}>
          <EmailSection
            onChange={(data) => handleChannelConfigChange("email", data)}
            value={channelConfigs.email || {}}
          />
        </Suspense>
      );
    case "google":
      return (
        <GoogleAdsForm
          channelConfigs={channelConfigs.google}
          handleChannelConfigChange={(config) =>
            handleChannelConfigChange("google", config)
          }
        />
      );
    case "meta":
      return (
        <Box>
          <Typography variant="h6" mb={2}>
            Meta Ads Setup
          </Typography>
          <MetaAdsForm
            onChange={(data) => handleChannelConfigChange("meta", data)}
            value={channelConfigs.meta || {}}
          />
        </Box>
      );
    case "linkedin":
      return (
        <Box>
          <Typography variant="h6" mb={2}>
            LinkedIn Ads Setup
          </Typography>
          <LinkedInAdsForm
            onChange={(data) => handleChannelConfigChange("linkedin", data)}
            value={channelConfigs.linkedin || {}}
          />
        </Box>
      );
    case "whatsapp":
      return (
        <Box>
          <Typography variant="h6" mb={2}>
            WhatsApp Broadcast Setup
          </Typography>
          <WhatsappForm
            onChange={(data) => handleChannelConfigChange("whatsapp", data)}
            value={channelConfigs.whatsapp || {}}
          />
        </Box>
      );
    default:
      return (
        <Typography>No configuration available for this channel.</Typography>
      );
  }
};

function CreateCampaignPage() {
  // Add state initialization for variant data here
  const [variantAData, setVariantAData] = useState({
    name: "",
    description: "",
    // Add other fields if needed (budget, startDate, etc.)
  });

  const [variantBData, setVariantBData] = useState({
    name: "",
    description: "",
  });

  // Add the handleSubmit function here
  const handleSubmit = async () => {
    const payload = {
      isABTesting,
      variants: isABTesting ? [variantAData, variantBData] : [variantAData],
    };

    try {
      const res = await axios.post("/api/campaigns", payload);
      console.log("Campaign created", res.data);
    } catch (err) {
      console.error("Failed to create campaign", err);
    }
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [step, setStep] = useState(0);
  const [masterCampaign, setMasterCampaign] = useState({
    name: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
    status: "draft",
  });

  const [selectedChannels, setSelectedChannels] = useState([]);
  const [channelConfigs, setChannelConfigs] = useState({});
  const [activeChannel, setActiveChannel] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selected, setSelected] = useState("");

  const [configuredChannels, setConfiguredChannels] = useState({
    googleAds: false,
    email: false,
    facebook: false,
  });

  const options = [
    { id: "1", name: "List 1" },
    { id: "2", name: "List 2" },
  ];

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
      setStep(3);
    }
  };

  const handleToastClose = (_, reason) => {
    if (reason === "clickaway") return;
    setToast({ ...toast, open: false });
  };

  const handleActivateCampaign = async () => {
    try {
      const channels = selectedChannels.map((key) => ({
        campaignType: key,
        configuration: channelConfigs[key] || {},
        status: "draft",
      }));

      const payload = {
        name: masterCampaign.name,
        description: masterCampaign.description,
        budget: Number(masterCampaign.budget),
        startDate: masterCampaign.startDate,
        endDate: masterCampaign.endDate,
        status: masterCampaign.status.toLowerCase(),
        channels,
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

  const getSafeValue = () => {
    const validIds = options.map((o) => String(o.id));
    return validIds.includes(selected) ? selected : "";
  };
  const ReviewSection = () => {
    const handleLaunchAllChannels = async () => {
      try {
        const channels = selectedChannels.map((key) => ({
          campaignType: key,
          configuration: channelConfigs[key] || {},
          status: "active", // Change status to active for launching
        }));

        const payload = {
          name: masterCampaign.name,
          description: masterCampaign.description,
          budget: Number(masterCampaign.budget),
          startDate: masterCampaign.startDate,
          endDate: masterCampaign.endDate,
          status: masterCampaign.status.toLowerCase(),
          channels,
        };

        const response = await axios.post(`${API_URL}/launch`, payload);

        setToast({
          open: true,
          message: "All channels launched successfully!",
          severity: "success",
        });
        console.log("Channels launched:", response.data);
      } catch (error) {
        console.error("Failed to launch channels:", error);
        setToast({
          open: true,
          message: "Failed to launch channels",
          severity: "error",
        });
      }
    };

    return (
      <Box>
        <Typography variant="h6" mb={2}>
          Review & Launch
        </Typography>
        <ReviewAndLaunch
          masterCampaign={masterCampaign}
          selectedChannels={selectedChannels}
          channelConfigs={channelConfigs}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={handleLaunchAllChannels}
          disabled={!Object.values(configuredChannels).every(Boolean)}
        >
          Launch All Channels
        </Button>
      </Box>
    );
  };

  const [isABTesting, setIsABTesting] = useState(false);

  return (
    <Box sx={{ flex: 1, p: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          📁 Create Campaign
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body1">Enable A/B Testing</Typography>
          <Switch
            checked={isABTesting}
            onChange={() => setIsABTesting(!isABTesting)}
            color="primary"
          />
        </Box>
      </Box>
      <Stepper
        activeStep={step}
        alternativeLabel
        sx={{ mb: 4, width: "100%", maxWidth: 800, mx: "auto" }}
      >
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {/* Variants Container */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          minHeight: 480,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Variant A */}
        <motion.div
          className="variant-card"
          style={{ flex: isABTesting ? 1 : 1 }}
          initial={{ width: "100%" }}
          animate={{ width: isABTesting ? "50%" : "100%" }}
          transition={{ duration: 0.3 }}
        >
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              height: "100%",
              boxShadow: 3,
            }}
          >
            <Typography variant="h5" fontWeight="bold" mb={3}>
              🅰️ Main Campaign
            </Typography>
            {step === 0 && (
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: theme.palette.background.paper,
                  boxShadow: 2,
                  minWidth: isMobile ? "90vw" : 400,
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
                <TextField
                  select
                  label="Select List"
                  value={getSafeValue()}
                  onChange={(e) => setSelected(String(e.target.value))}
                  fullWidth
                >
                  <MenuItem value="">Select a list</MenuItem>
                  {options.map((opt) => (
                    <MenuItem key={opt.id} value={String(opt.id)}>
                      {opt.name}
                    </MenuItem>
                  ))}
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

            <Box sx={{ display: step === 0 ? "block" : "none" }}>
              {/* Master Campaign Form */}
              <TextField
                label="Campaign Name"
                name="name"
                value={masterCampaign.name}
                onChange={handleMasterChange}
                fullWidth
                margin="normal"
              />
              {/* ... other master campaign fields ... */}
            </Box>

            {/* Show variant A fields when not in master campaign step */}
            <Box sx={{ display: step !== 0 ? "block" : "none" }}>
              <CampaignForm
                variant="A"
                formData={variantAData}
                setFormData={setVariantAData}
              />
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" mb={2}>
                  🛣️ Channel Configuration
                </Typography>
                {/* Existing channel configuration components */}
              </Box>
            </Box>
          </Card>
        </motion.div>

        <AnimatePresence>
          {isABTesting && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              style={{ flex: 1 }}
            >
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: "100%",
                  boxShadow: 3,
                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="h5" fontWeight="bold" mb={3}>
                  🅱️ Variant B
                </Typography>
                <CampaignForm
                  variant="B"
                  formData={variantBData}
                  setFormData={setVariantBData}
                />
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" mb={2}>
                    🛣️ Channel Configuration
                  </Typography>
                  {/* Duplicated channel configuration for variant B */}
                </Box>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

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

      {step === 2 && activeChannel && (
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            background: theme.palette.background.paper,
            boxShadow: 2,
            minWidth: isMobile ? "90vw" : 400,
          }}
        >
          <ChannelConfigForm
            channelKey={activeChannel}
            channelConfigs={channelConfigs}
            handleChannelConfigChange={handleChannelConfigChange}
          />
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

      {step === 3 && <ReviewSection />}

      {/* Submit Button */}
      <Box sx={{ pt: 4, width: "100%", maxWidth: 1200, mx: "auto" }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={handleSubmit}
          sx={{
            borderRadius: 2,
            py: 1.5,
            textTransform: "none",
            fontSize: "1.125rem",
          }}
        >
          🚀 Launch Campaign
        </Button>
      </Box>

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
