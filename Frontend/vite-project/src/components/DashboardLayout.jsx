import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Button,
  Tooltip,
  Paper,
  Fade,
  Slide,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  AccountBalanceWallet as BudgetIcon,
  Group as TeamIcon,
  Settings as SettingsIcon,
  Campaign as CampaignIcon,
  AddCircle as CreateIcon,
  Insights as OptimizationIcon,
  Analytics as AnalyticsIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Lock as LockIcon,
  Refresh as RefreshIcon,
  Announcement as AnnouncementIcon,
} from "@mui/icons-material";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const drawerWidth = 240;

const sidebarLinks = [
  { label: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
  { label: "Campaigns", icon: <CampaignIcon />, to: "/campaigns" },
  { label: "Create Campaign", icon: <CreateIcon />, to: "/create-campaign" },
  { label: "Calendar", icon: <CalendarIcon />, to: "/calendar" },
  { label: "Email Campaigns", icon: <EmailIcon />, to: "/email-campaign" },
  { label: "Budget Management", icon: <BudgetIcon />, to: "/budget-management" },
  { label: "Analytics", icon: <AnalyticsIcon />, to: "/analytics" },
  { label: "Optimization", icon: <OptimizationIcon />, to: "/optimization" },
  { label: "Team", icon: <TeamIcon />, to: "/org-team", adminOnly: true },
  { label: "Settings", icon: <SettingsIcon />, to: "/settings" },
];

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Dummy user/usage data (replace with real API if needed)
  const user = { name: "Admin", role: "admin" };
  const usage = {
    plan: "Pro",
    campaigns: 3,
    campaignLimit: 10,
    emailsSent: 150,
    emailLimit: 500,
    aiTokens: 2500,
    aiTokenLimit: 5000,
    members: 5,
    lastPrompt: "Generate ad copy for summer sale",
  };

  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // Only show admin routes if user is admin
  const filteredLinks = sidebarLinks.filter(
    (link) => !link.adminOnly || user.role === "admin"
  );

  // Sidebar with gradient, bold, hover/active, animation
  const drawer = (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "linear-gradient(180deg, #23233a 0%, #181824 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        boxShadow: 6,
      }}
    >
      <Toolbar sx={{ minHeight: 64 }} />
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <List sx={{ flexGrow: 1, px: 0, py: 2 }}>
        {filteredLinks.map((item, idx) => (
          <Slide in direction="right" timeout={400 + idx * 80} key={item.label}>
            <ListItem
              button
              component={NavLink}
              to={item.to}
              sx={{
                "&.active, &:hover": {
                  bgcolor: "rgba(124,58,237,0.18)",
                  color: "#a78bfa",
                  borderRight: "4px solid #a78bfa",
                  fontWeight: 700,
                  transform: "scale(1.04)",
                  transition: "all 0.2s",
                },
                mb: 0.5,
                mx: 0,
                px: 3,
                py: 1.2,
                borderRadius: "0 20px 20px 0",
                transition: "all 0.2s",
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
              onClick={() => isMobile && setMobileOpen(false)}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          </Slide>
        ))}
      </List>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          fullWidth
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            borderColor: "#a78bfa",
            color: "#a78bfa",
            "&:hover": {
              borderColor: "#fff",
              background: "rgba(124,58,237,0.08)",
            },
          }}
          onClick={() => navigate("/")}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        color="default"
        elevation={4}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "rgba(30,30,46,0.98)",
          background: "linear-gradient(90deg, #23233a 0%, #3f51b5 100%)",
          boxShadow: "0 4px 24px 0 rgba(124,58,237,0.15)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: "bold",
                color: "#a78bfa",
                letterSpacing: 1,
                cursor: "pointer",
                textShadow: "0 2px 8px #23233a",
                fontSize: "1.5rem",
              }}
              onClick={() => navigate("/dashboard")}
            >
              🌐 CampAIn
            </Typography>
            <Button
              color="inherit"
              endIcon={<LockIcon sx={{ color: "gold" }} />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                ml: 2,
                color: "#fff",
                bgcolor: "#7c3aed",
                borderRadius: 2,
                px: 2,
                boxShadow: "0 2px 8px #7c3aed44",
                "&:hover": { bgcolor: "#a78bfa", color: "#23233a" },
                transition: "all 0.2s",
              }}
            >
              {usage.plan}
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title={user.name}>
              <Avatar
                sx={{
                  bgcolor: "#a78bfa",
                  color: "#23233a",
                  fontWeight: 700,
                  border: "2px solid #fff",
                  boxShadow: "0 2px 8px #7c3aed44",
                  transition: "all 0.2s",
                }}
              >
                {user.name?.[0] || "U"}
              </Avatar>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="sidebar"
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              bgcolor: "transparent",
              color: "#fff",
              boxSizing: "border-box",
              borderRight: 0,
              boxShadow: "0 8px 32px 0 rgba(124,58,237,0.12)",
              backdropFilter: "blur(6px)",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          mt: 8,
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          transition: "background 0.3s",
        }}
      >
        {/* Main routed content */}
        <Fade in timeout={600}>
          <Box>
            <Outlet />
            {/* Cards below main content */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
                mt: 4,
                alignItems: { md: "flex-start" },
              }}
            >
              <Paper
                elevation={8}
                sx={{
                  flex: 1,
                  bgcolor: "linear-gradient(135deg, #23233a 60%, #7c3aed 100%)",
                  borderRadius: 3,
                  p: 3,
                  color: "#fff",
                  boxShadow: "0 4px 32px 0 #7c3aed33",
                  mb: { xs: 2, md: 0 },
                  transform: "scale(1)",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <Typography variant="subtitle2" color="#a78bfa" gutterBottom>
                  Plan: {usage.plan}{" "}
                  {usage.plan === "Pro" && (
                    <LockIcon fontSize="small" sx={{ color: "gold", ml: 0.5 }} />
                  )}
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    sx={{
                      ml: 2,
                      fontWeight: 600,
                      boxShadow: "0 2px 8px #f50057aa",
                    }}
                    onClick={() => navigate("/billing")}
                  >
                    Upgrade Plan
                  </Button>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Campaigns: {usage.campaigns} / {usage.campaignLimit}
                </Typography>
                <Typography variant="body2">
                  Emails Sent: {usage.emailsSent} / {usage.emailLimit}
                </Typography>
                <Typography variant="body2">
                  AI Tokens Used: {usage.aiTokens} / {usage.aiTokenLimit}
                </Typography>
              </Paper>
              <Paper
                elevation={8}
                sx={{
                  flex: 1,
                  bgcolor: "linear-gradient(135deg, #23233a 60%, #22d3ee 100%)",
                  borderRadius: 3,
                  p: 3,
                  color: "#fff",
                  boxShadow: "0 4px 32px 0 #22d3ee33",
                  transform: "scale(1)",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <Typography variant="subtitle2" color="#22d3ee" gutterBottom>
                  Team Summary
                </Typography>
                <Typography variant="body2">
                  Total Members: {usage.members}
                </Typography>
                <Typography variant="body2">
                  Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Typography>
              </Paper>
              <Paper
                elevation={8}
                sx={{
                  flex: 1,
                  bgcolor: "linear-gradient(135deg, #23233a 60%, #f50057 100%)",
                  borderRadius: 3,
                  p: 3,
                  color: "#fff",
                  boxShadow: "0 4px 32px 0 #f5005733",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 1,
                  transform: "scale(1)",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <Typography variant="subtitle2" color="#f50057" gutterBottom>
                  🧠 AI Snapshot
                </Typography>
                <Typography variant="body2">
                  Last Prompt: "{usage.lastPrompt}"
                  <IconButton size="small" sx={{ ml: 1, color: "#fff" }}>
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <AnnouncementIcon color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    📢 Announcements: Try the optimizer!
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
