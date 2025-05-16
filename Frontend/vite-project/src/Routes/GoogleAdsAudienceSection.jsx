import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
} from "@mui/material";

const GoogleAdsAudienceSection = ({ onChange }) => {
  const [audience, setAudience] = useState({
    age: [],
    gender: [],
    parentalStatus: false,
    country: "",
    city: "",
    radius: "10",
    languages: [],
    interests: [],
    inMarketSegments: [],
    customKeywords: "",
    customUrls: "",
    customApps: "",
    devices: [],
    remarketing: [],
  });

  const update = (key, value) => {
    setAudience((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    onChange?.(audience);
  }, [audience]);

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Manual Audience Selection
      </Typography>

      <Typography variant="subtitle1" mt={2}>
        1. Demographics
      </Typography>
      <TextField
        select
        label="Age Range"
        SelectProps={{ multiple: true }}
        value={audience.age}
        onChange={(e) => update("age", e.target.value)}
        fullWidth
        margin="normal"
      >
        {["18-24", "25-34", "35-44", "45+"].map((a) => (
          <MenuItem key={a} value={a}>
            {a}
          </MenuItem>
        ))}
      </TextField>

      <FormGroup row>
        {["Male", "Female"].map((g) => (
          <FormControlLabel
            key={g}
            control={
              <Checkbox
                checked={audience.gender.includes(g)}
                onChange={(e) => {
                  const val = e.target.checked
                    ? [...audience.gender, g]
                    : audience.gender.filter((x) => x !== g);
                  update("gender", val);
                }}
              />
            }
            label={g}
          />
        ))}
      </FormGroup>

      <FormControlLabel
        control={
          <Checkbox
            checked={audience.parentalStatus}
            onChange={(e) => update("parentalStatus", e.target.checked)}
          />
        }
        label="Parent"
      />

      <Typography variant="subtitle1" mt={2}>
        2. Location Targeting
      </Typography>
      <TextField
        label="Country"
        value={audience.country}
        onChange={(e) => update("country", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="City / Region"
        value={audience.city}
        onChange={(e) => update("city", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Radius (in km)"
        value={audience.radius}
        onChange={(e) => update("radius", e.target.value)}
        fullWidth
        margin="normal"
      />

      <Typography variant="subtitle1" mt={2}>
        3. Language Preferences
      </Typography>
      <TextField
        label="Languages"
        placeholder="e.g., English, Hindi"
        value={audience.languages}
        onChange={(e) => update("languages", e.target.value.split(","))}
        fullWidth
        margin="normal"
      />

      <Typography variant="subtitle1" mt={2}>
        4. Interests (Affinity)
      </Typography>
      <FormGroup row>
        {["Tech", "Fitness", "Business", "Fashion"].map((interest) => (
          <FormControlLabel
            key={interest}
            control={
              <Checkbox
                checked={audience.interests.includes(interest)}
                onChange={(e) => {
                  const val = e.target.checked
                    ? [...audience.interests, interest]
                    : audience.interests.filter((x) => x !== interest);
                  update("interests", val);
                }}
              />
            }
            label={interest}
          />
        ))}
      </FormGroup>

      <Typography variant="subtitle1" mt={2}>
        5. In-Market Segments
      </Typography>
      <FormGroup row>
        {["Software Buyers", "Online Education"].map((seg) => (
          <FormControlLabel
            key={seg}
            control={
              <Checkbox
                checked={audience.inMarketSegments.includes(seg)}
                onChange={(e) => {
                  const val = e.target.checked
                    ? [...audience.inMarketSegments, seg]
                    : audience.inMarketSegments.filter((x) => x !== seg);
                  update("inMarketSegments", val);
                }}
              />
            }
            label={seg}
          />
        ))}
      </FormGroup>

      <Typography variant="subtitle1" mt={2}>
        6. Custom Audience
      </Typography>
      <TextField
        label="Keywords"
        value={audience.customKeywords}
        onChange={(e) => update("customKeywords", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="URLs"
        value={audience.customUrls}
        onChange={(e) => update("customUrls", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Apps"
        value={audience.customApps}
        onChange={(e) => update("customApps", e.target.value)}
        fullWidth
        margin="normal"
      />

      <Typography variant="subtitle1" mt={2}>
        7. Device Targeting
      </Typography>
      <FormGroup row>
        {["Desktop", "Mobile"].map((device) => (
          <FormControlLabel
            key={device}
            control={
              <Checkbox
                checked={audience.devices.includes(device)}
                onChange={(e) => {
                  const val = e.target.checked
                    ? [...audience.devices, device]
                    : audience.devices.filter((x) => x !== device);
                  update("devices", val);
                }}
              />
            }
            label={device}
          />
        ))}
      </FormGroup>

      <Typography variant="subtitle1" mt={2}>
        8. Remarketing
      </Typography>
      <FormGroup row>
        {["Past Visitors", "Abandoned Forms"].map((opt) => (
          <FormControlLabel
            key={opt}
            control={
              <Checkbox
                checked={audience.remarketing.includes(opt)}
                onChange={(e) => {
                  const val = e.target.checked
                    ? [...audience.remarketing, opt]
                    : audience.remarketing.filter((x) => x !== opt);
                  update("remarketing", val);
                }}
              />
            }
            label={opt}
          />
        ))}
      </FormGroup>

      <Typography variant="body2" mt={3}>
        <strong>Audience Summary:</strong>
        <br />
        Age: {audience.age.join(", ") || "Any"}, Location:{" "}
        {audience.city || audience.country || "N/A"}, Radius: {audience.radius}
        km
      </Typography>
    </Paper>
  );
};

export default GoogleAdsAudienceSection;
