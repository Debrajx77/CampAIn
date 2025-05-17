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
import LinkedInAdsAudienceSection from "./LinkedInAdsAudienceSection";

const LinkedInAdsForm = ({
  onSubmit,
  campaignId,
  setConfiguredChannels,
  toast,
}) => {
  const [adHeadline, setAdHeadline] = useState("");
  const [adDescription, setAdDescription] = useState("");
  const [audienceType, setAudienceType] = useState("existing");
  const [selectedList, setSelectedList] = useState("");
  const [manualAudience, setManualAudience] = useState({});

  const handleSave = async () => {
    try {
      const data = {
        headline: adHeadline,
        description: adDescription,
        audienceType,
        existingList: audienceType === "existing" ? selectedList : "",
        manualAudience: audienceType === "manual" ? manualAudience : {},
      };

      await axios.post("/api/campaigns/save-linkedin-ads", {
        campaignId,
        linkedInAds: data,
      });

      setConfiguredChannels((prev) => ({ ...prev, linkedInAds: true }));
      toast.success("LinkedIn Ads saved successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Error saving LinkedIn Ads.");
    }
  };

  return (
    <Card className="p-4 w-full max-w-3xl mx-auto">
      <CardContent>
        <Typography variant="h6">LinkedIn Ads</Typography>

        <div className="space-y-4 mt-4">
          <TextField
            label="Ad Headline"
            value={adHeadline}
            onChange={(e) => setAdHeadline(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Ad Description"
            value={adDescription}
            onChange={(e) => setAdDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
          />

          <Typography>Audience Type</Typography>
          <Select
            value={audienceType}
            onChange={(e) => setAudienceType(e.target.value)}
            fullWidth
          >
            <MenuItem value="existing">Use Existing List</MenuItem>
            <MenuItem value="manual">Create Manual List</MenuItem>
          </Select>

          {audienceType === "existing" && (
            <div>
              <Typography>Select Audience List</Typography>
              <Select
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
                fullWidth
              >
                <MenuItem value="hr-leads">HR Leads</MenuItem>
                <MenuItem value="senior-devs">Senior Developers</MenuItem>
              </Select>
            </div>
          )}

          {audienceType === "manual" && (
            <LinkedInAdsAudienceSection
              audience={manualAudience}
              setAudience={setManualAudience}
            />
          )}

          <Button variant="contained" color="primary" onClick={handleSave}>
            Save LinkedIn Ads
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedInAdsForm;
