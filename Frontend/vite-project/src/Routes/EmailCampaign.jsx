import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  Grid,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PreviewIcon from "@mui/icons-material/Visibility";
import { styled } from "@mui/system";
import axios from "axios";

const DarkPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#1e1e1e",
  color: "#fff",
  padding: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
}));

const EmailCampaign = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleSend = async () => {
    try {
      const response = await axios.post(
        "https://campain-b2rr.onrender.com/api/email/send",
        { to, subject, body }
      );

      if (response.data.success) {
        setSuccess(true);
        setTo("");
        setSubject("");
        setBody("");
        setFile(null);
      } else {
        throw new Error("Failed to send email.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <DarkPaper>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Launch Email Campaign 🚀
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Reach your audience directly with personalized email campaigns.
        </Typography>

        <Grid container spacing={3} mt={2}>
          <Grid item xs={12}>
            <TextField
              label="Recipient Email"
              fullWidth
              variant="filled"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              InputProps={{ style: { color: "white" } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Subject"
              fullWidth
              variant="filled"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              InputProps={{ style: { color: "white" } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email Body"
              multiline
              rows={8}
              fullWidth
              variant="filled"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              InputProps={{ style: { color: "white" } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<AttachFileIcon />}
              sx={{ color: "#00e676", borderColor: "#00e676" }}
            >
              Attach File
              <input
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Button>
            {file && (
              <Typography variant="body2" mt={1}>
                Attached: {file.name}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6} textAlign="right">
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={() => setPreviewOpen(true)}
              sx={{ color: "#29b6f6", borderColor: "#29b6f6" }}
            >
              Preview
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSend}
                sx={{
                  backgroundColor: "#00bfa5",
                  color: "#fff",
                  px: 4,
                  py: 1.5,
                  borderRadius: "12px",
                  "&:hover": {
                    backgroundColor: "#008e76",
                  },
                }}
              >
                Send Email
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DarkPaper>

      {/* Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" variant="filled">
          Email sent successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
      >
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>

      {/* Preview Modal */}
      {previewOpen && (
        <DarkPaper sx={{ mt: 4 }}>
          <Typography variant="h6">Preview</Typography>
          <Typography variant="subtitle2">To: {to}</Typography>
          <Typography variant="subtitle2">Subject: {subject}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {body}
          </Typography>
          <Box mt={2} textAlign="right">
            <Button variant="contained" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
          </Box>
        </DarkPaper>
      )}
    </Container>
  );
};

export default EmailCampaign;
