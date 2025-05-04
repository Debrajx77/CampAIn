import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Slide,
  Paper,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Define the custom theme
const darkVioletTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9b5de5", // Violet shade
    },
    background: {
      default: "#121212",
      paper: "#1e1e2f",
    },
    text: {
      primary: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
});

const EmailCampaign = () => {
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        "https://campain-2.onrender.com/api/campaign/123/email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            recipients: recipients.split(","),
            subject,
            message,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.msg || "Failed to send email campaign");
        return;
      }

      setSuccess("Email campaign sent successfully!");
      setRecipients("");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error("Error sending email campaign:", err);
      setError("Server error");
    }
  };

  return (
    <ThemeProvider theme={darkVioletTheme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom>
            Send Email Campaign
          </Typography>

          <Slide direction="down" in={!!success} mountOnEnter unmountOnExit>
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          </Slide>

          <Slide direction="down" in={!!error} mountOnEnter unmountOnExit>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Slide>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Recipients"
              fullWidth
              required
              margin="normal"
              placeholder="Enter recipient emails, separated by commas"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
            />

            <TextField
              label="Subject"
              fullWidth
              required
              margin="normal"
              placeholder="Enter email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <TextField
              label="Message"
              fullWidth
              required
              multiline
              rows={5}
              margin="normal"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              color="primary"
            >
              Send Email Campaign
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default EmailCampaign;
