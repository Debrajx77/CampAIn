import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Modal,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const OrganizationAndTeamPage = () => {
  const [organizations, setOrganizations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const fetchOrganizations = async () => {
    try {
      const res = await axios.get("/api/organization"); // fixed endpoint (singular)
      // API returns single organization object, wrap in array for map
      if (Array.isArray(res.data)) {
        setOrganizations(res.data);
      } else if (res.data) {
        setOrganizations([res.data]);
      } else {
        setOrganizations([]);
      }
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
      setOrganizations([]);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await axios.get("/api/team/view"); // fixed endpoint
      // Assuming API returns single team object or array
      if (Array.isArray(res.data)) {
        setTeams(res.data);
      } else if (res.data) {
        setTeams([res.data]);
      } else {
        setTeams([]);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      setTeams([]);
    }
  };

  const handleCreateOrganization = async () => {
    if (!newOrgName) return;
    try {
      await axios.post("/api/organization", { name: newOrgName }); // fixed endpoint singular
      setNewOrgName("");
      fetchOrganizations();
    } catch (error) {
      console.error("Failed to create organization:", error);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole || !selectedTeam) return;
    try {
      await axios.put(`/api/team/${selectedTeam}/add-member`, {
        userId: selectedUser,
        role: selectedRole,
      });
      setOpen(false);
      setSelectedUser("");
      setSelectedRole("");
      fetchTeams();
    } catch (error) {
      console.error("Failed to assign role:", error);
    }
  };

  useEffect(() => {
    fetchOrganizations();
    fetchTeams();
  }, []);

  return (
    <Box p={4} bgcolor="#121212" color="#fff" minHeight="100vh">
      <Typography variant="h4" gutterBottom>
        Organizations
      </Typography>
      <Box display="flex" mb={4} gap={2}>
        <TextField
          label="New Organization"
          variant="filled"
          value={newOrgName}
          onChange={(e) => setNewOrgName(e.target.value)}
          InputProps={{ style: { backgroundColor: "#1e1e1e", color: "#fff" } }}
          InputLabelProps={{ style: { color: "#aaa" } }}
        />
        <Button variant="contained" onClick={handleCreateOrganization}>
          Create
        </Button>
      </Box>
      <Grid container spacing={2}>
        {organizations.length > 0 ? (
          organizations.map((org) => (
            <Grid item xs={12} sm={6} md={4} key={org._id}>
              <Card style={{ backgroundColor: "#1e1e1e", color: "#fff" }}>
                <CardContent>
                  <Typography variant="h6">{org.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No organizations found.</Typography>
        )}
      </Grid>

      <Typography variant="h4" mt={6} gutterBottom>
        Teams
      </Typography>
      <Grid container spacing={2}>
        {teams.length > 0 ? (
          teams.map((team) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={team._id}
              onClick={() => {
                setSelectedTeam(team._id);
                setOpen(true);
              }}
              style={{ cursor: "pointer" }}
            >
              <Card style={{ backgroundColor: "#1e1e1e", color: "#fff" }}>
                <CardContent>
                  <Typography variant="h6">{team.name}</Typography>
                  <Typography variant="body2">
                    Members: {team.members ? team.members.length : 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No teams found.</Typography>
        )}
      </Grid>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          bgcolor="#2c2c2c"
          color="#fff"
          p={4}
          borderRadius={2}
          position="absolute"
          top="50%"
          left="50%"
          style={{ transform: "translate(-50%, -50%)", width: 400 }}
        >
          <Typography variant="h6" mb={2}>
            Assign Role
          </Typography>
          <TextField
            label="User ID"
            fullWidth
            variant="filled"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            InputProps={{
              style: { backgroundColor: "#1e1e1e", color: "#fff" },
            }}
            InputLabelProps={{ style: { color: "#aaa" } }}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Role"
            fullWidth
            variant="filled"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            InputProps={{
              style: { backgroundColor: "#1e1e1e", color: "#fff" },
            }}
            InputLabelProps={{ style: { color: "#aaa" } }}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="member">Member</MenuItem>
          </TextField>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleAssignRole}
          >
            Assign
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default OrganizationAndTeamPage;
