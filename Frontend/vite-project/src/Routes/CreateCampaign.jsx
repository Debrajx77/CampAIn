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
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const CAMPAIGN_TYPES = [
  {
    key: "email",
    title: "Email Campaign",
    description: "Send personalized emails to your audience.",
    icon: <EmailIcon fontSize="large" color="primary" />,
  },
  {
    key: "google",
    title: "Google Ads",
    description: "Reach customers with search and display ads.",
    icon: <GoogleIcon fontSize="large" sx={{ color: "#4285F4" }} />,
  },
  {
    key: "meta",
    title: "Meta Ads",
    description: "Advertise on Facebook and Instagram.",
    icon: <FacebookIcon fontSize="large" sx={{ color: "#1877F3" }} />,
  },
  {
    key: "linkedin",
    title: "LinkedIn Ads",
    description: "Target professionals on LinkedIn.",
    icon: <LinkedInIcon fontSize="large" sx={{ color: "#0A66C2" }} />,
  },
  {
    key: "whatsapp",
    title: "WhatsApp Broadcast",
    description: "Send bulk messages to WhatsApp users.",
    icon: <WhatsAppIcon fontSize="large" sx={{ color: "#25D366" }} />,
  },
];

function CreateCampaignPage() {
  const [selectedType, setSelectedType] = useState(null);
  const [campaignName, setCampaignName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCreateCampaign = (e) => {
    e.preventDefault();

    if (!selectedType) {
      setError("Please select a campaign type.");
      return;
    }

    setError(null);

    // Example: Log form data or send to backend
    console.log({
      campaignName,
      description,
      budget,
      startDate,
      endDate,
      selectedType,
    });

    // Reset form or navigate as needed
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-4 py-8 gap-8">
      <form
        onSubmit={handleCreateCampaign}
        className="bg-neutral-900 p-8 rounded-2xl shadow-xl w-full max-w-lg border border-neutral-800"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">
          🎯 Create Campaign
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Campaign Name"
            className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          ></textarea>
          <input
            type="number"
            placeholder="Budget ($)"
            className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition font-semibold"
          >
            🚀 Create Campaign
          </button>
        </div>
      </form>

      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 2,
          background: theme.palette.background.paper,
          boxShadow: 2,
          minWidth: isMobile ? "90vw" : 400,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Select a Campaign Type
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {CAMPAIGN_TYPES.map(({ key, title, description, icon }) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Card
                variant="outlined"
                sx={{
                  borderColor: selectedType === key ? "purple" : "transparent",
                  boxShadow: selectedType === key ? 3 : 1,
                }}
              >
                <CardActionArea onClick={() => setSelectedType(key)}>
                  <CardContent sx={{ textAlign: "center" }}>
                    {icon}
                    <Typography variant="h6" mt={1}>
                      {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 3 }}>
          You selected:{" "}
          {CAMPAIGN_TYPES.find((t) => t.key === selectedType)?.title || "None"}
        </Typography>
        <Typography color="text.secondary">– Form coming soon...</Typography>
      </Box>
    </div>
  );
}

export default CreateCampaignPage;
