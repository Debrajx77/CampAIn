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
} from "@mui/material";
import { motion } from "framer-motion"; // Import motion from framer-motion
import { io } from "socket.io-client";

const socket = io("https://your-backend-url.onrender.com", {
  transports: ["websocket"],
  credentials: true,
}); // Connect to the backend WebSocket server

function CampaignDetails() {
  const { id: campaignId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComments();

    // Listen for real-time comments
    socket.on("commentAdded", (comment) => {
      if (comment.campaignId === campaignId) {
        setComments((prevComments) => [...prevComments, comment]);
      }
    });

    return () => {
      socket.off("commentAdded"); // Clean up the listener
    };
  }, [campaignId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/campaign/${campaignId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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

    try {
      const res = await fetch(
        `http://localhost:5000/api/campaign/${campaignId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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

      // Emit the new comment to the WebSocket server
      socket.emit("newComment", {
        ...data.comments[data.comments.length - 1],
        campaignId,
      });
    } catch (err) {
      console.error("Error adding comment:", err);
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
                InputLabelProps={{
                  style: { color: "#aaa" },
                }}
                InputProps={{
                  style: { color: "#fff" },
                }}
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
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            )}
          </motion.div>
        </>
      )}

      {/* Link to Optimization Insights */}
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
