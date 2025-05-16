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

const GoogleAdsForm = ({ onSubmit }) => {
  const [adTitle, setAdTitle] = useState("");
  const [adDescription, setAdDescription] = useState("");
  const [audienceType, setAudienceType] = useState("existing");
  const [selectedList, setSelectedList] = useState("");
  const [csvFile, setCsvFile] = useState(null);

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

          <Button type="submit" variant="contained" color="primary">
            Launch Ad
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GoogleAdsForm;
