import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Stack,
  Paper,
  Chip,
  Button,
} from "@mui/material";

const MetaAdsAudiencePanel = ({ onChange }) => {
  const [audienceType, setAudienceType] = useState("existing");
  const [existingList, setExistingList] = useState("");
  const [manualAudience, setManualAudience] = useState({
    age: [],
    gender: [],
    location: "",
    interests: [],
    behaviors: [],
    device: [],
  });

  useEffect(() => {
    onChange?.({ audienceType, existingList, manualAudience });
  }, [audienceType, existingList, manualAudience]);

  const handleManualChange = (field, value) => {
    setManualAudience((prev) => ({ ...prev, [field]: value }));
  };

  const toggleChip = (field, val) => {
    setManualAudience((prev) => {
      const updated = prev[field].includes(val)
        ? prev[field].filter((v) => v !== val)
        : [...prev[field], val];
      return { ...prev, [field]: updated };
    });
  };

  const ageOptions = ["18-24", "25-34", "35-44", "45-54", "55+"];
  const genderOptions = ["Male", "Female", "Other"];
  const interestOptions = ["Ecommerce", "Fashion", "Tech", "Fitness"];
  const behaviorOptions = ["Frequent Buyers", "Brand Engagers"];
  const deviceOptions = ["Mobile", "Desktop"];

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" mb={2}>
        Meta Ads Audience Targeting
      </Typography>
      <TextField
        select
        label="Audience Type"
        value={audienceType}
        onChange={(e) => setAudienceType(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="existing">Existing List</MenuItem>
        <MenuItem value="manual">Manual Entry</MenuItem>
      </TextField>

      {audienceType === "existing" && (
        <TextField
          label="Select List"
          fullWidth
          margin="normal"
          value={existingList}
          onChange={(e) => setExistingList(e.target.value)}
        />
      )}

      {audienceType === "manual" && (
        <Box mt={2}>
          <Typography variant="subtitle1">Age</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {ageOptions.map((age) => (
              <Chip
                key={age}
                label={age}
                color={manualAudience.age.includes(age) ? "primary" : "default"}
                onClick={() => toggleChip("age", age)}
              />
            ))}
          </Stack>

          <Typography variant="subtitle1" mt={2}>
            Gender
          </Typography>
          <Stack direction="row" spacing={1}>
            {genderOptions.map((g) => (
              <FormControlLabel
                key={g}
                control={
                  <Checkbox
                    checked={manualAudience.gender.includes(g)}
                    onChange={() => toggleChip("gender", g)}
                  />
                }
                label={g}
              />
            ))}
          </Stack>

          <TextField
            label="Location"
            fullWidth
            margin="normal"
            value={manualAudience.location}
            onChange={(e) => handleManualChange("location", e.target.value)}
          />

          <Typography variant="subtitle1">Interests</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {interestOptions.map((i) => (
              <Chip
                key={i}
                label={i}
                color={
                  manualAudience.interests.includes(i) ? "primary" : "default"
                }
                onClick={() => toggleChip("interests", i)}
              />
            ))}
          </Stack>

          <Typography variant="subtitle1" mt={2}>
            Behaviors
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {behaviorOptions.map((b) => (
              <Chip
                key={b}
                label={b}
                color={
                  manualAudience.behaviors.includes(b) ? "primary" : "default"
                }
                onClick={() => toggleChip("behaviors", b)}
              />
            ))}
          </Stack>

          <Typography variant="subtitle1" mt={2}>
            Devices
          </Typography>
          <Stack direction="row" spacing={1}>
            {deviceOptions.map((d) => (
              <FormControlLabel
                key={d}
                control={
                  <Checkbox
                    checked={manualAudience.device.includes(d)}
                    onChange={() => toggleChip("device", d)}
                  />
                }
                label={d}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Paper>
  );
};

export default MetaAdsAudiencePanel;
