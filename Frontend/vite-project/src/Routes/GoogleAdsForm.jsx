import React, { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import axios from "axios";
import GoogleAudienceSection from "./src/Routes/GoogleAudienceSection"; // Import the Google Audience Section

const GoogleAdsForm = ({
  onSubmit,
  campaignId,
  setConfiguredChannels,
  toast,
}) => {
  const [adTitle, setAdTitle] = useState("");
  const [adDescription, setAdDescription] = useState("");
  const [audienceType, setAudienceType] = useState("existing");
  const [selectedList, setSelectedList] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", adTitle);
    formData.append("description", adDescription);
    formData.append("audienceType", audienceType);
    formData.append("list", selectedList);
    onSubmit(formData);
  };

  const handleSaveGoogleAds = async () => {
    try {
      const googleAdsData = {
        title: adTitle,
        description: adDescription,
        audienceType,
        list: selectedList,
      };

      await axios.post("/api/campaigns/save-google-ads", {
        campaignId,
        googleAds: googleAdsData,
      });

      setConfiguredChannels((prev) => ({ ...prev, googleAds: true }));
      toast.success("Google Ads configuration saved.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save Google Ads.");
    }
  };

  return (
    <Card className="p-4 w-full max-w-3xl mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Typography>Ad Title</Typography>
            <TextField
              value={adTitle}
              onChange={(e) => setAdTitle(e.target.value)}
              required
              fullWidth
            />
          </div>
          <div>
            <Typography>Ad Description</Typography>
            <TextField
              value={adDescription}
              onChange={(e) => setAdDescription(e.target.value)}
              required
              fullWidth
              multiline
              rows={4}
            />
          </div>
          <div>
            <Typography>Audience</Typography>
            <Select
              value={audienceType}
              onChange={(e) => setAudienceType(e.target.value)}
              fullWidth
            >
              <MenuItem value="existing">Use Existing List</MenuItem>
              <MenuItem value="manual">Create Manual List</MenuItem>
            </Select>
          </div>

          {audienceType === "existing" && (
            <div>
              <Typography>Select Audience List</Typography>
              <Select
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
                fullWidth
              >
                <MenuItem value="fashion">Fashion Users</MenuItem>
                <MenuItem value="tech">Tech Buyers</MenuItem>
              </Select>
            </div>
          )}

          {/* Integrate Google Audience Section */}
          <GoogleAudienceSection />

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleSaveGoogleAds}
            sx={{ mt: 2 }}
          >
            Save Configuration
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GoogleAdsForm;
