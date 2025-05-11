import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(
          "https://campain-b2rr.onrender.com/api/campaigns",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.msg || "Failed to fetch campaigns");
          return;
        }

        setCampaigns(data);
      } catch (err) {
        console.error(err);
        setError("Server error");
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        All Campaigns
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {campaigns.map((campaign) => (
          <Grid item xs={12} sm={6} md={4} key={campaign._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{campaign.campaignName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {campaign.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Budget: ${campaign.budget}
                </Typography>
                <Button variant="contained" color="primary" size="small">
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Campaigns;
