import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Editor, EditorState, RichUtils, convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

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
  const [existingList, setExistingList] = useState("");

  useEffect(() => {
    onChange?.({
      subject,
      fromEmail,
      replyTo,
      emailBody: convertToRaw(editorState.getCurrentContent()),
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

  useEffect(() => {
    if (audienceType !== "existing" && existingList !== "") {
      setExistingList("");
    }
    if (audienceType === "existing") {
      const validIds = lists.filter(Boolean).map((l) => String(l.id));
      if (existingList && !validIds.includes(existingList)) {
        setExistingList("");
      }
    }
  }, [audienceType, existingList, lists]);

  const getSafeExistingListValue = () => {
    if (!Array.isArray(lists) || lists.length === 0) return "";
    const validIds = lists.filter(Boolean).map((l) => String(l.id));
    return validIds.includes(existingList) ? existingList : "";
  };

  const handleStyleClick = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const handleBlockTypeClick = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

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

      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "12px",
          backgroundColor: "#fafafa",
        }}
      >
        <Box sx={{ mb: 1, display: "flex", gap: 1 }}>
          <Tooltip title="Bold">
            <IconButton onClick={() => handleStyleClick("BOLD")}>
              <FormatBoldIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Italic">
            <IconButton onClick={() => handleStyleClick("ITALIC")}>
              <FormatItalicIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Underline">
            <IconButton onClick={() => handleStyleClick("UNDERLINE")}>
              <FormatUnderlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Bullet List">
            <IconButton
              onClick={() => handleBlockTypeClick("unordered-list-item")}
            >
              <FormatListBulletedIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          sx={{
            minHeight: "120px",
            cursor: "text",
          }}
          onClick={() => {
            // focus editor when box is clicked
            document.querySelector("[data-editor]")?.focus();
          }}
        >
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            placeholder="Compose your email here..."
            spellCheck
          />
        </Box>
      </Box>

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
        {AUDIENCE_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      {audienceType === "existing" && (
        <TextField
          select
          label="Select Existing List"
          value={getSafeExistingListValue()}
          onChange={(e) => setExistingList(String(e.target.value))}
          fullWidth
          margin="normal"
        >
          <MenuItem value="">
            {Array.isArray(lists) && lists.filter(Boolean).length > 0
              ? "Select a list"
              : "No lists found"}
          </MenuItem>
          {Array.isArray(lists) &&
            lists.filter(Boolean).map((list) => (
              <MenuItem key={String(list.id)} value={String(list.id)}>
                {list.name}
              </MenuItem>
            ))}
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
          {csvFile?.name && (
            <Typography mt={1}>{String(csvFile.name)}</Typography>
          )}
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
