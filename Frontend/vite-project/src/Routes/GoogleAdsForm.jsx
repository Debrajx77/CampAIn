// Folder: frontend/components/campaigns/GoogleAdsForm.jsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Input,
  Label,
  Button,
  Textarea,
  Select,
  SelectItem,
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
            <Label>Ad Title</Label>
            <Input
              value={adTitle}
              onChange={(e) => setAdTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Ad Description</Label>
            <Textarea
              value={adDescription}
              onChange={(e) => setAdDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Audience</Label>
            <Select value={audienceType} onValueChange={setAudienceType}>
              <SelectItem value="existing">Use Existing List</SelectItem>
              <SelectItem value="csv">Upload CSV</SelectItem>
              <SelectItem value="manual">Create Manual List</SelectItem>
            </Select>
          </div>

          {audienceType === "existing" && (
            <div>
              <Label>Select Audience List</Label>
              <Select value={selectedList} onValueChange={setSelectedList}>
                <SelectItem value="fashion">Fashion Users</SelectItem>
                <SelectItem value="tech">Tech Buyers</SelectItem>
              </Select>
            </div>
          )}

          {audienceType === "csv" && (
            <div>
              <Label>Upload CSV</Label>
              <Input
                type="file"
                onChange={(e) => setCsvFile(e.target.files[0])}
              />
            </div>
          )}

          <Button type="submit">Launch Ad</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GoogleAdsForm;
