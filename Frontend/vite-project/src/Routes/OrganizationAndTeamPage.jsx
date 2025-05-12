// $javascript:CampAIn/Frontend/vite-project/src/Routes/OrganizationAndTeamPage.jsx
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
  IconButton,
  Tooltip,
  Divider,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import axios from "axios";

const PLAN_LIMITS = { free: 3, premium: 10 };

const OrganizationAndTeamPage = () => {
  const [organization, setOrganization] = useState(null);
  const [teams, setTeams] = useState([]);
  const [openOrgModal, setOpenOrgModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviteTeamId, setInviteTeamId] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [assignUserId, setAssignUserId] = useState("");
  const [assignRole, setAssignRole] = useState("member");
  const [openTeamModal, setOpenTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    msg: "",
    severity: "success",
  });

  // Fetch organization and teams on mount
  useEffect(() => {
    fetchOrganization();
    fetchTeams();
  }, []);

  const fetchOrganization = async () => {
    try {
      const res = await axios.get("/api/organization");
      setOrganization(res.data);
    } catch (error) {
      setOrganization(null);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await axios.get("/api/team/view");
      setTeams(res.data);
    } catch (error) {
      setTeams([]);
    }
  };

  // Create Organization
  const handleCreateOrganization = async () => {
    try {
      await axios.post("/api/organization", { name: newOrgName });
      setSnackbar({
        open: true,
        msg: "Organization created!",
        severity: "success",
      });
      setOpenOrgModal(false);
      setNewOrgName("");
      fetchOrganization();
    } catch (error) {
      setSnackbar({
        open: true,
        msg: "Failed to create organization",
        severity: "error",
      });
    }
  };

  // Invite/Add Member with optional team assignment
  const handleInviteMember = async () => {
    try {
      await axios.post("/api/organization/invite", {
        email: inviteEmail,
        role: inviteRole,
        teamId: inviteTeamId || null,
      });
      setSnackbar({
        open: true,
        msg: "Member invited/added!",
        severity: "success",
      });
      setInviteEmail("");
      setInviteTeamId("");
      fetchOrganization();
      fetchTeams();
    } catch (error) {
      setSnackbar({
        open: true,
        msg: error?.response?.data?.msg || "Failed to invite",
        severity: "error",
      });
    }
  };

  // Remove Member
  const handleRemoveMember = async (userId) => {
    try {
      await axios.delete("/api/organization/remove-member", {
        data: { userId },
      });
      setSnackbar({ open: true, msg: "Member removed!", severity: "success" });
      fetchOrganization();
    } catch (error) {
      setSnackbar({
        open: true,
        msg: "Failed to remove member",
        severity: "error",
      });
    }
  };

  // Change Role
  const handleChangeRole = async (userId, role) => {
    try {
      await axios.put("/api/organization/change-role", { userId, role });
      setSnackbar({ open: true, msg: "Role updated!", severity: "success" });
      fetchOrganization();
    } catch (error) {
      setSnackbar({
        open: true,
        msg: "Failed to update role",
        severity: "error",
      });
    }
  };

  // Assign member to team
  const handleAssignToTeam = async () => {
    if (!selectedTeam || !assignUserId) return;
    try {
      await axios.put(`/api/team/${selectedTeam}/add-member`, {
        userId: assignUserId,
        role: assignRole,
      });
      setSnackbar({
        open: true,
        msg: "Member assigned to team!",
        severity: "success",
      });
      setSelectedTeam(null);
      setAssignUserId("");
      fetchTeams();
    } catch (error) {
      setSnackbar({
        open: true,
        msg: "Failed to assign to team",
        severity: "error",
      });
    }
  };

  // Create Team
  const handleCreateTeam = async () => {
    try {
      await axios.post("/api/team", { name: newTeamName });
      setSnackbar({
        open: true,
        msg: "Team created!",
        severity: "success",
      });
      setOpenTeamModal(false);
      setNewTeamName("");
      fetchTeams();
    } catch (error) {
      setSnackbar({
        open: true,
        msg: "Failed to create team",
        severity: "error",
      });
    }
  };

  // Plan limit logic
  const memberLimit = PLAN_LIMITS[organization?.plan || "free"];
  const atLimit = organization?.members?.length >= memberLimit;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Organization & Teams
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {!organization && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenOrgModal(true)}
            >
              Create Organization
            </Button>
          )}
          {organization && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenTeamModal(true)}
            >
              Create Team
            </Button>
          )}
        </Box>
      </Box>

      {/* Organization Info */}
      {organization && (
        <Card sx={{ mb: 4, bgcolor: "background.paper", color: "#fff" }}>
          <CardContent>
            <Typography variant="h6">{organization.name}</Typography>
            <Typography variant="body2" sx={{ color: "grey.400" }}>
              Plan:{" "}
              <Chip label={organization.plan} color="primary" size="small" />
              {"  "}Members: {organization?.members?.length || 0}/{memberLimit}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Members
            </Typography>
            <Grid container spacing={2}>
              {(organization?.members || []).map((m) => (
                <Grid item xs={12} sm={6} md={4} key={m.user._id}>
                  <Card sx={{ bgcolor: "#23293a" }}>
                    <CardContent>
                      <Typography fontWeight={600}>{m.user.name}</Typography>
                      <Typography variant="body2" color="grey.400">
                        {m.user.email}
                      </Typography>
                      <Typography variant="body2" color="grey.400">
                        Role: {m.role}
                      </Typography>
                    </CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        pb: 1,
                        pr: 1,
                      }}
                    >
                      <TextField
                        select
                        size="small"
                        value={m.role}
                        onChange={(e) =>
                          handleChangeRole(m.user._id, e.target.value)
                        }
                        sx={{ mr: 1, minWidth: 100, bgcolor: "#181c24" }}
                      >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="member">Member</MenuItem>
                      </TextField>
                      <Tooltip title="Remove">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveMember(m.user._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Invite/Add Member */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Invite/Add Member
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <TextField
                  label="Email"
                  size="small"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  disabled={atLimit}
                  sx={{ bgcolor: "#181c24" }}
                />
                <TextField
                  select
                  label="Role"
                  size="small"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  disabled={atLimit}
                  sx={{ bgcolor: "#181c24" }}
                >
                  <MenuItem value="member">Member</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </TextField>

                {/* Team select dropdown */}
                <TextField
                  select
                  label="Team"
                  size="small"
                  value={inviteTeamId}
                  onChange={(e) => setInviteTeamId(e.target.value)}
                  disabled={atLimit || !teams.length}
                  sx={{ bgcolor: "#181c24", minWidth: 150 }}
                >
                  <MenuItem value="">None</MenuItem>
                  {teams.map((team) => (
                    <MenuItem key={team._id} value={team._id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleInviteMember}
                  disabled={atLimit || !inviteEmail}
                >
                  Invite/Add
                </Button>
                {atLimit && (
                  <Typography color="error" fontWeight={600}>
                    Member limit reached! Upgrade plan.
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Teams Section */}
      <Box>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
          Teams
        </Typography>
        <Grid container spacing={2}>
          {(Array.isArray(teams) ? teams : []).filter(Boolean).map((team) => (
            <Grid item xs={12} sm={6} md={4} key={team._id}>
              <Card sx={{ bgcolor: "#23293a" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <GroupIcon sx={{ mr: 1 }} />
                    <Typography fontWeight={600}>{team.name}</Typography>
                  </Box>
                  <Typography variant="body2" color="grey.400">
                    Members: {team?.members?.length || 0}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2">Assign Member</Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <TextField
                      select
                      size="small"
                      label="User"
                      value={assignUserId}
                      onChange={(e) => setAssignUserId(e.target.value)}
                      sx={{ bgcolor: "#181c24", minWidth: 120 }}
                    >
                      {(Array.isArray(organization?.members)
                        ? organization.members
                        : []
                      )
                        .filter((orgMember) => {
                          const teamMembersArr = Array.isArray(team?.members)
                            ? team.members.map((member) => {
                                if (
                                  member &&
                                  typeof member === "object" &&
                                  member.user
                                ) {
                                  return member.user._id?.toString?.();
                                }
                                if (
                                  member &&
                                  typeof member === "object" &&
                                  member._id
                                ) {
                                  return member._id?.toString?.();
                                }
                                if (typeof member === "string") {
                                  return member;
                                }
                                return "";
                              })
                            : [];
                          return !teamMembersArr.includes(
                            orgMember.user._id?.toString()
                          );
                        })
                        .map((m) => (
                          <MenuItem key={m.user._id} value={m.user._id}>
                            {m.user.name}
                          </MenuItem>
                        ))}
                    </TextField>{" "}
                    <TextField
                      select
                      size="small"
                      label="Role"
                      value={assignRole}
                      onChange={(e) => setAssignRole(e.target.value)}
                      sx={{ bgcolor: "#181c24", minWidth: 100 }}
                    >
                      <MenuItem value="member">Member</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        setSelectedTeam(team._id);
                        handleAssignToTeam();
                      }}
                      disabled={!assignUserId}
                    >
                      Assign
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Create Org Modal */}
      <Modal open={openOrgModal} onClose={() => setOpenOrgModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            minWidth: 350,
          }}
        >
          <Typography variant="h6" mb={2}>
            Create Organization
          </Typography>
          <TextField
            label="Organization Name"
            fullWidth
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            sx={{ mb: 2, bgcolor: "#181c24" }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCreateOrganization}
            disabled={!newOrgName}
          >
            Create
          </Button>
        </Box>
      </Modal>

      {/* Create Team Modal */}
      <Modal open={openTeamModal} onClose={() => setOpenTeamModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            minWidth: 350,
          }}
        >
          <Typography variant="h6" mb={2}>
            Create Team
          </Typography>
          <TextField
            label="Team Name"
            fullWidth
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            sx={{ mb: 2, bgcolor: "#181c24" }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCreateTeam}
            disabled={!newTeamName}
          >
            Create
          </Button>
        </Box>
      </Modal>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrganizationAndTeamPage;
