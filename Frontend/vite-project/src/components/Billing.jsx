import React, { useEffect, useState } from "react";
import { createCheckoutSession, getSubscriptionStatus } from "../api/billing";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const plans = [
  {
    id: "price_free",
    name: "Free",
    price: "$0",
    billingCycle: "per month",
    features: ["Limited campaigns", "Small team", "Basic support"],
    priceId: null,
  },
  {
    id: "price_pro",
    name: "Pro",
    price: "$29",
    billingCycle: "per month",
    features: [
      "Unlimited campaigns",
      "Medium team",
      "AI optimization",
      "Priority support",
    ],
    priceId: "price_1ProXXX", // Replace with your Stripe price ID
  },
  {
    id: "price_enterprise",
    name: "Enterprise",
    price: "Contact us",
    billingCycle: "",
    features: [
      "All Pro features",
      "Large team",
      "Dedicated support",
      "Custom integrations",
    ],
    priceId: "price_1EntXXX", // Replace with your Stripe price ID
  },
];

export default function Billing() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    getSubscriptionStatus()
      .then(setSubscription)
      .catch(() => setSubscription(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (priceId) => {
    if (!priceId) {
      alert("You are on the free plan.");
      return;
    }
    try {
      const url = await createCheckoutSession(priceId);
      window.location.href = url;
    } catch (err) {
      alert("Failed to start checkout. Please try again.");
      console.error(err);
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: theme.palette.text.primary,
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );

  return (
    <Box
      sx={{
        minHeight: "80vh",
        py: 6,
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant={isMobile ? "h4" : "h3"}
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 6 }}
        >
          Choose Your Plan
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan) => {
            const isCurrent =
              subscription?.plan === plan.name.toLowerCase() &&
              subscription?.status === "active";

            return (
              <Grid item xs={12} sm={6} md={4} key={plan.id}>
                <Card
                  elevation={isCurrent ? 12 : 4}
                  sx={{
                    bgcolor: isCurrent
                      ? theme.palette.primary.dark
                      : theme.palette.background.paper,
                    color: isCurrent
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: theme.shadows[10],
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h5"
                      component="div"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      {plan.name}
                    </Typography>
                    <Box
                      sx={{ display: "flex", alignItems: "baseline", mb: 3 }}
                    >
                      <Typography
                        variant="h4"
                        component="div"
                        sx={{ fontWeight: "bold" }}
                      >
                        {plan.price}
                      </Typography>
                      {plan.billingCycle && (
                        <Typography
                          variant="subtitle1"
                          component="div"
                          sx={{
                            ml: 1,
                            color: isCurrent
                              ? "rgba(255,255,255,0.7)"
                              : "text.secondary",
                          }}
                        >
                          {plan.billingCycle}
                        </Typography>
                      )}
                    </Box>
                    <List dense>
                      {plan.features.map((feature) => (
                        <ListItem key={feature} disableGutters>
                          <ListItemIcon
                            sx={{ color: isCurrent ? "lightgreen" : "green" }}
                          >
                            <CheckCircleIcon />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <CardActions sx={{ p: 3 }}>
                    <Button
                      fullWidth
                      variant={isCurrent ? "contained" : "outlined"}
                      color={isCurrent ? "secondary" : "primary"}
                      disabled={isCurrent}
                      onClick={() => handleSubscribe(plan.priceId)}
                      sx={{
                        fontWeight: "bold",
                        textTransform: "none",
                        py: 1.5,
                      }}
                    >
                      {isCurrent
                        ? "Current Plan"
                        : plan.priceId
                        ? "Subscribe"
                        : "Free"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
