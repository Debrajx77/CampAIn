import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Alert,
  Paper,
  CircularProgress,
  Slide,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Fade,
} from "@mui/material";

// Custom dark violet theme
const darkVioletTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9b5de5", // Violet
    },
    background: {
      default: "#121212",
      paper: "#1e1e2f",
    },
    text: {
      primary: "#ffffff",
    },
    warning: {
      main: "#ff6b6b",
    },
  },
});

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await fetch(
        "https://campain-b2rr.onrender.com/api/campaigns/budgets",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.msg || "Failed to fetch budgets");
        return;
      }

      const data = await res.json();
      setBudgets(data);
    } catch (err) {
      console.error("Error fetching budgets:", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkVioletTheme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>
          Budget Management
        </Typography>

        <Slide direction="down" in={!!error} mountOnEnter unmountOnExit>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Slide>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Box display="grid" gap={3}>
            {budgets.map((budget, index) => (
              <Fade in timeout={500 + index * 200} key={budget.title}>
                <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {budget.title}
                  </Typography>
                  <Typography>Budget: ${budget.budget}</Typography>
                  <Typography>Spent: ${budget.spent}</Typography>
                  <Typography>Remaining: ${budget.remaining}</Typography>
                  {budget.remaining <= budget.budget * 0.1 && (
                    <Typography color="warning.main" sx={{ mt: 1 }}>
                      Warning: Budget is almost exhausted!
                    </Typography>
                  )}
                </Paper>
              </Fade>
            ))}
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default BudgetManagement;
