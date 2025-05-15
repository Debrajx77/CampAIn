// EmailSection.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
} from "@mui/material";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";

const AUDIENCE_OPTIONS = [
  { value: "existing", label: "Existing List" },
  { value: "csv", label: "Upload CSV" },
  { value: "manual", label: "Manual Entry" },
];

const EmailSection = ({ onChange, lists = [] }) => {
  const [subject, setSubject] = useState("");
  const [fromEmail] = useState("youragency@email.com");
  const [replyTo, setReplyTo] = useState("support@email.com");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [audienceType, setAudienceType] = useState("existing");
  const [manualEmails, setManualEmails] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [existingList, setExistingList] = useState(""); // For dropdown if you fetch lists

  // Notify parent on change
  useEffect(() => {
    onChange &&
      onChange({
        subject,
        fromEmail,
        replyTo,
        emailBody: editorState.getCurrentContent().getPlainText(),
        audienceType,
        manualEmails,
        csvFile,
        existingList,
      });
  }, [
    subject,
    fromEmail,
    replyTo,
    editorState,
    audienceType,
    manualEmails,
    csvFile,
    existingList,
    onChange,
  ]);

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" mb={2}>
        Email Details
      </Typography>
      <TextField
        label="Subject"
        fullWidth
        margin="normal"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <TextField
        label="From"
        fullWidth
        margin="normal"
        value={fromEmail}
        disabled
      />
      <TextField
        label="Reply To"
        fullWidth
        margin="normal"
        value={replyTo}
        onChange={(e) => setReplyTo(e.target.value)}
      />

      <Typography variant="h6" mt={4} mb={2}>
        Compose Email
      </Typography>
      <Editor editorState={editorState} onChange={setEditorState} />

      <Typography variant="h6" mt={4} mb={2}>
        Audience Selection
      </Typography>
      <TextField
        select
        label="Audience Type"
        value={audienceType}
        onChange={(e) => setAudienceType(e.target.value)}
        fullWidth
        margin="normal"
      >
        {AUDIENCE_OPTIONS.map((opt) => {
          if (!opt) return null;
          return (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          );
        })}
      </TextField>

      {audienceType === "existing" && (
        <TextField
          select
          label="Select Existing List"
          value={existingList}
          onChange={(e) => setExistingList(e.target.value)}
          fullWidth
          margin="normal"
        >
          {/* Always render at least one MenuItem */}
          {(!lists || lists.length === 0) && (
            <MenuItem disabled value="">
              No lists found
            </MenuItem>
          )}
          {Array.isArray(lists) &&
            lists.map(
              (list) =>
                list && (
                  <MenuItem key={list.id} value={list.id}>
                    {list.name}
                  </MenuItem>
                )
            )}
        </TextField>
      )}

      {audienceType === "csv" && (
        <Box mt={2}>
          <Button variant="outlined" component="label">
            Upload CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => setCsvFile(e.target.files[0])}
            />
          </Button>
          {csvFile && <Typography mt={1}>{csvFile.name}</Typography>}
        </Box>
      )}

      {audienceType === "manual" && (
        <TextField
          label="Manual Emails"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          placeholder="Enter comma separated emails"
          value={manualEmails}
          onChange={(e) => setManualEmails(e.target.value)}
        />
      )}
    </Paper>
  );
};

export default EmailSection;
