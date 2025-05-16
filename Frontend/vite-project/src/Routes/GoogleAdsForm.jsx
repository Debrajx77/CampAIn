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
  const [csvFile, setCsvFile] = useState(null);

  // New state for Google Audience
  const [demographics, setDemographics] = useState({
    ageRange: [],
    gender: [],
    parentalStatus: [],
  });
  const [locationTargeting, setLocationTargeting] = useState({
    country: "",
    cityOrRegion: "",
    radiusKm: 0,
  });
  const [languages, setLanguages] = useState([]);
  const [interests, setInterests] = useState([]);
  const [inMarketSegments, setInMarketSegments] = useState([]);
  const [customAudience, setCustomAudience] = useState({
    keywords: [],
    urls: [],
    apps: [],
  });
  const [deviceTargeting, setDeviceTargeting] = useState([]);
  const [remarketing, setRemarketing] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", adTitle);
    formData.append("description", adDescription);
    formData.append("audienceType", audienceType);
    if (audienceType === "csv") {
      formData.append("csv", csvFile);
    } else {
      formData.append("list", selectedList);
    }
    onSubmit(formData);
  };

  const handleSaveGoogleAds = async () => {
    try {
      const googleAdsData = {
        title: adTitle,
        description: adDescription,
        audienceType,
        list: selectedList,
        csv: csvFile,
        demographics,
        locationTargeting,
        languages,
        interests,
        inMarketSegments,
        customAudience,
        deviceTargeting,
        remarketing,
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
              <MenuItem value="csv">Upload CSV</MenuItem>
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

          {audienceType === "csv" && (
            <div>
              <Typography>Upload CSV</Typography>
              <TextField
                type="file"
                onChange={(e) => setCsvFile(e.target.files[0])}
                fullWidth
              />
            </div>
          )}

          {/* Google Audience Section */}
          <div>
            <Typography>Demographics</Typography>
            <TextField
              label="Age Range"
              value={demographics.ageRange.join(", ")}
              onChange={(e) =>
                setDemographics({
                  ...demographics,
                  ageRange: e.target.value.split(", "),
                })
              }
              fullWidth
            />
            <TextField
              label="Gender"
              value={demographics.gender.join(", ")}
              onChange={(e) =>
                setDemographics({
                  ...demographics,
                  gender: e.target.value.split(", "),
                })
              }
              fullWidth
            />
            <TextField
              label="Parental Status"
              value={demographics.parentalStatus.join(", ")}
              onChange={(e) =>
                setDemographics({
                  ...demographics,
                  parentalStatus: e.target.value.split(", "),
                })
              }
              fullWidth
            />
          </div>
          <div>
            <Typography>Location Targeting</Typography>
            <TextField
              label="Country"
              value={locationTargeting.country}
              onChange={(e) =>
                setLocationTargeting({
                  ...locationTargeting,
                  country: e.target.value,
                })
              }
              fullWidth
            />
            <TextField
              label="City or Region"
              value={locationTargeting.cityOrRegion}
              onChange={(e) =>
                setLocationTargeting({
                  ...locationTargeting,
                  cityOrRegion: e.target.value,
                })
              }
              fullWidth
            />
            <TextField
              label="Radius (Km)"
              type="number"
              value={locationTargeting.radiusKm}
              onChange={(e) =>
                setLocationTargeting({
                  ...locationTargeting,
                  radiusKm: e.target.value,
                })
              }
              fullWidth
            />
          </div>
          <div>
            <Typography>Languages</Typography>
            <TextField
              value={languages.join(", ")}
              onChange={(e) => setLanguages(e.target.value.split(", "))}
              fullWidth
            />
          </div>
          <div>
            <Typography>Interests</Typography>
            <TextField
              value={interests.join(", ")}
              onChange={(e) => setInterests(e.target.value.split(", "))}
              fullWidth
            />
          </div>
          <div>
            <Typography>In-Market Segments</Typography>
            <TextField
              value={inMarketSegments.join(", ")}
              onChange={(e) => setInMarketSegments(e.target.value.split(", "))}
              fullWidth
            />
          </div>
          <div>
            <Typography>Custom Audience</Typography>
            <TextField
              label="Keywords"
              value={customAudience.keywords.join(", ")}
              onChange={(e) =>
                setCustomAudience({
                  ...customAudience,
                  keywords: e.target.value.split(", "),
                })
              }
              fullWidth
            />
            <TextField
              label="URLs"
              value={customAudience.urls.join(", ")}
              onChange={(e) =>
                setCustomAudience({
                  ...customAudience,
                  urls: e.target.value.split(", "),
                })
              }
              fullWidth
            />
            <TextField
              label="Apps"
              value={customAudience.apps.join(", ")}
              onChange={(e) =>
                setCustomAudience({
                  ...customAudience,
                  apps: e.target.value.split(", "),
                })
              }
              fullWidth
            />
          </div>
          <div>
            <Typography>Device Targeting</Typography>
            <TextField
              value={deviceTargeting.join(", ")}
              onChange={(e) => setDeviceTargeting(e.target.value.split(", "))}
              fullWidth
            />
          </div>
          <div>
            <Typography>Remarketing</Typography>
            <TextField
              value={remarketing.join(", ")}
              onChange={(e) => setRemarketing(e.target.value.split(", "))}
              fullWidth
            />
          </div>

          <Button type="submit" variant="contained" color="primary">
            Launch Ad
          </Button>
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
