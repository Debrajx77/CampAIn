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
import WhatsAppAudienceSection from "./WhatsappAudienceSection";

const WhatsAppForm = ({ campaignId, setConfiguredChannels, toast }) => {
  const [message, setMessage] = useState("");
  const [audienceType, setAudienceType] = useState("existing");
  const [existingList, setExistingList] = useState("");
  const [manualAudience, setManualAudience] = useState({
    phoneNumbers: "",
    tags: "",
  });

  const handleSave = async () => {
    try {
      const whatsappData = {
        message,
        audienceType,
        existingList,
        manualAudience,
      };

      const res = await fetch("/api/campaigns/save-whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ campaignId, whatsapp: whatsappData }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setConfiguredChannels((prev) => ({ ...prev, whatsapp: true }));
      toast.success("WhatsApp Broadcast Configured");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Card className="p-4 w-full max-w-3xl mx-auto">
      <CardContent>
        <Typography variant="h6">WhatsApp Message</Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <Typography className="mt-4">Audience Type</Typography>
        <Select
          fullWidth
          value={audienceType}
          onChange={(e) => setAudienceType(e.target.value)}
        >
          <MenuItem value="existing">Use Existing List</MenuItem>
          <MenuItem value="manual">Create Manual List</MenuItem>
        </Select>

        {audienceType === "existing" && (
          <div className="mt-2">
            <Typography>Select Audience List</Typography>
            <Select
              fullWidth
              value={existingList}
              onChange={(e) => setExistingList(e.target.value)}
            >
              <MenuItem value="lead-customers">Lead Customers</MenuItem>
              <MenuItem value="event-attendees">Event Attendees</MenuItem>
            </Select>
          </div>
        )}

        {audienceType === "manual" && (
          <WhatsAppAudienceSection
            manualAudience={manualAudience}
            setManualAudience={setManualAudience}
          />
        )}

        <Button
          onClick={handleSave}
          variant="contained"
          color="success"
          className="mt-4"
        >
          Save Configuration
        </Button>
      </CardContent>
    </Card>
  );
};

export default WhatsAppForm;
