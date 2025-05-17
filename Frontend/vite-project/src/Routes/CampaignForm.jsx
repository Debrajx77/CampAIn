import React from "react";
import { TextField, Grid } from "@mui/material";

const CampaignForm = ({ variant, formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label={`Campaign Name (${variant})`}
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={`Description (${variant})`}
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
        />
      </Grid>
    </Grid>
  );
};

export default CampaignForm;
