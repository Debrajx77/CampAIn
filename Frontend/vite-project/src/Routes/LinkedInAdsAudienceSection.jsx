import React from "react";
import {
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";

const LinkedInAdsAudienceSection = ({ audience, setAudience }) => {
  const handleChange = (field, value) => {
    setAudience((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mt-4 space-y-4">
      <Typography variant="h6">Manual Audience Selection</Typography>

      <div>
        <Typography>Age</Typography>
        <Select
          value={audience.age || ""}
          onChange={(e) => handleChange("age", e.target.value)}
          fullWidth
          multiple
        >
          {["18-24", "25-34", "35-44", "45-54", "55+"].map((age) => (
            <MenuItem key={age} value={age}>
              {age}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div>
        <Typography>Gender</Typography>
        <FormGroup row>
          {["male", "female"].map((gender) => (
            <FormControlLabel
              key={gender}
              control={
                <Checkbox
                  checked={audience.gender?.includes(gender) || false}
                  onChange={(e) =>
                    handleChange(
                      "gender",
                      e.target.checked
                        ? [...(audience.gender || []), gender]
                        : audience.gender.filter((g) => g !== gender)
                    )
                  }
                />
              }
              label={gender}
            />
          ))}
        </FormGroup>
      </div>

      <div>
        <Typography>Location</Typography>
        <TextField
          value={audience.location || ""}
          onChange={(e) => handleChange("location", e.target.value)}
          fullWidth
        />
      </div>

      <div>
        <Typography>Industries</Typography>
        <TextField
          value={audience.industries || ""}
          onChange={(e) => handleChange("industries", e.target.value)}
          placeholder="e.g., IT, Finance"
          fullWidth
        />
      </div>

      <div>
        <Typography>Job Titles</Typography>
        <TextField
          value={audience.jobTitles || ""}
          onChange={(e) => handleChange("jobTitles", e.target.value)}
          fullWidth
        />
      </div>
    </div>
  );
};

export default LinkedInAdsAudienceSection;
