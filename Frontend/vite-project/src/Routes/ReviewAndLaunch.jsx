import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const ChannelCard = ({ type, config }) => (
  <Card className="rounded-2xl shadow-md p-4">
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {type} Ads
      </Typography>
      <Divider className="mb-2" />
      {Object.entries(config).map(([key, value]) => (
        <Typography key={key} variant="body2" className="mb-1">
          <strong>{key}:</strong>{" "}
          {Array.isArray(value) ? value.join(", ") : value?.toString()}
        </Typography>
      ))}
    </CardContent>
  </Card>
);

const ReviewAndLaunchPage = ({ campaignId }) => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/campaigns/${campaignId}`).then((res) => {
      setCampaign(res.data);
      setLoading(false);
    });
  }, [campaignId]);

  if (loading) return <CircularProgress />;

  if (!campaign) return <Typography>No campaign found.</Typography>;

  return (
    <div className="p-6 space-y-6">
      <Typography variant="h5">Campaign Preview</Typography>

      <Grid container spacing={2}>
        {Array.isArray(campaign.channels) ? (
          campaign.channels.map((channel, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <ChannelCard
                type={channel.type || channel.campaignType || "Unknown"}
                config={channel}
              />
            </Grid>
          ))
        ) : (
          <Typography>No channels available.</Typography>
        )}
      </Grid>

      <div className="flex justify-end space-x-4 pt-4">
        <button className="px-4 py-2 bg-gray-300 rounded-lg">Back</button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
          Launch Campaign
        </button>
      </div>
    </div>
  );
};

export default ReviewAndLaunchPage;
