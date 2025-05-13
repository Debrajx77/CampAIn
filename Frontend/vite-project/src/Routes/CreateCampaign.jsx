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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Create Campaign
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        Choose a campaign type to get started
      </Typography>
      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ maxWidth: 1100, width: "100%", mb: 4 }}
      >
        {CAMPAIGN_TYPES.map((type) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={type.key}>
            <Card
              elevation={selectedType === type.key ? 8 : 2}
              sx={{
                borderRadius: 3,
                border:
                  selectedType === type.key
                    ? `2px solid ${theme.palette.primary.main}`
                    : "2px solid transparent",
                transition: "box-shadow 0.2s, border 0.2s",
                background:
                  selectedType === type.key
                    ? theme.palette.action.selected
                    : theme.palette.background.paper,
              }}
            >
              <CardActionArea onClick={() => setSelectedType(type.key)}>
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    {type.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedType && (
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
            You selected:{" "}
            {
              CAMPAIGN_TYPES.find((t) => t.key === selectedType)?.title
            }
          </Typography>
          <Typography color="text.secondary">
            – Form coming soon...
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default CreateCampaignPage;
