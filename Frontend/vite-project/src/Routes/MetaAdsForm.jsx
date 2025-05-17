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
import MetaAdsAudienceSection from "./MetaAdsAudienceSection"; // Import the Meta Audience Section

const MetaAdsForm = ({
  onSubmit,
  campaignId,
  setConfiguredChannels,
  toast,
}) => {
  const [adHeadline, setAdHeadline] = useState("");
  const [adPrimaryText, setAdPrimaryText] = useState("");
  const [audienceType, setAudienceType] = useState("existing");
  const [selectedList, setSelectedList] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("headline", adHeadline);
    formData.append("primaryText", adPrimaryText);
    formData.append("audienceType", audienceType);
    formData.append("list", selectedList);
    onSubmit(formData);
  };

  const handleSaveMetaAds = async () => {
    try {
      const metaAdsData = {
        headline: adHeadline,
        primaryText: adPrimaryText,
        audienceType,
        list: selectedList,
      };

      await axios.post("/api/campaigns/save-meta-ads", {
        campaignId,
        metaAds: metaAdsData,
      });

      setConfiguredChannels((prev) => ({ ...prev, metaAds: true }));
      toast.success("Meta Ads configuration saved.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save Meta Ads.");
    }
  };

  return (
    <Card className="p-4 w-full max-w-3xl mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Typography>Ad Headline</Typography>
            <TextField
              value={adHeadline}
              onChange={(e) => setAdHeadline(e.target.value)}
              required
              fullWidth
            />
          </div>
          <div>
            <Typography>Primary Text</Typography>
            <TextField
              value={adPrimaryText}
              onChange={(e) => setAdPrimaryText(e.target.value)}
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

          {/* Meta Audience Section */}
          {audienceType === "manual" && <MetaAdsAudienceSection />}

          <Button
            variant="outlined"
            color="primary"
            onClick={handleSaveMetaAds}
            sx={{ mt: 2 }}
          >
            Save Configuration
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MetaAdsForm;
