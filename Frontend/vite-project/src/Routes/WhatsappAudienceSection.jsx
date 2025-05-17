import React from "react";
import { Typography, TextField } from "@mui/material";

const WhatsAppAudienceSection = ({ manualAudience, setManualAudience }) => {
  return (
    <div className="space-y-4 mt-4">
      <div>
        <Typography>Phone Numbers (comma-separated)</Typography>
        <TextField
          fullWidth
          multiline
          rows={2}
          value={manualAudience.phoneNumbers}
          onChange={(e) =>
            setManualAudience((prev) => ({
              ...prev,
              phoneNumbers: e.target.value,
            }))
          }
        />
      </div>
      <div>
        <Typography>Tags (optional)</Typography>
        <TextField
          fullWidth
          value={manualAudience.tags}
          onChange={(e) =>
            setManualAudience((prev) => ({
              ...prev,
              tags: e.target.value,
            }))
          }
        />
      </div>
    </div>
  );
};

export default WhatsAppAudienceSection;
