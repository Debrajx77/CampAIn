import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
// Change the import for jwt-decode
import { jwtDecode } from "jwt-decode";

const socket = io("https://campain-b2rr.onrender.com", {
  transports: ["websocket"],
  credentials: true,
});

function CampaignDetails() {
  const { id: campaignId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token)?.id : null; // jwt_decode is now used correctly

  useEffect(() => {
    fetchComments();

    socket.on("commentAdded", (comment) => {
      if (comment.campaignId === campaignId) {
        setComments((prev) => [...prev, comment]);
      }
    });

    socket.on("commentDeleted", (deletedId) => {
      setComments((prev) => prev.filter((c) => c._id !== deletedId));
    });

    return () => {
      socket.off("commentAdded");
      socket.off("commentDeleted");
    };
  }, [campaignId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `https://campain-b2rr.onrender.com/api/campaign/${campaignId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || "Failed to fetch comments");
        return;
      }
      setComments(data.comments);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch(
        `https://campain-b2rr.onrender.com/api/campaign/${campaignId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: newComment }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || "Failed to add comment");
        return;
      }

      setNewComment("");
      socket.emit("newComment", {
        ...data.comment,
        campaignId,
      });
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Server error");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(
        `https://campain-b2rr.onrender.com/api/campaign/${campaignId}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || "Failed to delete comment");
        return;
      }

      socket.emit("deleteComment", commentId);
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError("Server error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#1e1e2f",
        color: "#fff",
        padding: "2rem",
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Campaign Comments
      </Typography>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          {/* Add Comment Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleAddComment} style={{ marginBottom: "2rem" }}>
              <TextField
                label="Write a comment"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{
                  backgroundColor: "#2a2a3b",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "#fff" } }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  textTransform: "none",
                  background: "linear-gradient(to right, #6a11cb, #2575fc)",
                }}
              >
                Add Comment
              </Button>
            </form>
          </motion.div>

          {/* Comments Section */}
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            All Comments
          </Typography>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {comments.length === 0 ? (
              <Typography>No comments yet. Be the first to comment!</Typography>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "1rem",
                }}
              >
                {comments.map((comment) => (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card
                      sx={{
                        backgroundColor: "#2a2a3b",
                        color: "#fff",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                        position: "relative",
                      }}
                    >
                      <CardContent>
                        <Typography variant="body1">{comment.text}</Typography>
                        <Typography
                          variant="body2"
                          color="gray"
                          sx={{ marginTop: "0.5rem" }}
                        >
                          By: {comment.user?.name || "Unknown"}
                        </Typography>

                        {/* ✅ Delete only visible to comment owner */}
                        {comment?.user?._id === userId && (
                          <IconButton
                            aria-label="delete"
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              color: "#f44336",
                            }}
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            )}
          </motion.div>
        </>
      )}

      {/* Link to Optimization Page */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginTop: "2rem" }}
      >
        <Link
          to={`/campaign/${campaignId}/optimize`}
          style={{
            color: "#6a11cb",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          View Optimization Insights
        </Link>
      </motion.div>
    </Box>
  );
}

export default CampaignDetails;
