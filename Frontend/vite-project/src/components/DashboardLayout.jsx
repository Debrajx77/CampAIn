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
  Menu,
  MenuItem,
  Tooltip,
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
  const [anchorEl, setAnchorEl] = useState(null);

  // TODO: Replace with real user/org/usage data from backend
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

  const drawer = (
    <Box
      sx={{
        height: "100vh", // Full viewport height
        bgcolor: "background.paper",
        color: "text.primary",
        display: "flex",
        flexDirection: "column",
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ minHeight: 64 }} />
      <Divider />
      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {filteredLinks.map((item) => (
          <ListItem
            button
            key={item.label}
            component={NavLink}
            to={item.to}
            sx={{
              "&.active, &.Mui-selected": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                borderRadius: 2,
              },
              mb: 0.5,
              mx: 0.5,
              px: 2,
              py: 1,
              transition: "background 0.2s",
            }}
            onClick={() => isMobile && setMobileOpen(false)}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          fullWidth
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
        elevation={2}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "background.paper",
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
                color: "primary.main",
                letterSpacing: 1,
                cursor: "pointer",
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
                color: "text.primary",
              }}
            >
              {usage.plan}
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title={user.name}>
              <Avatar sx={{ bgcolor: "primary.main" }}>
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
        {/* Mobile Drawer */}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              bgcolor: "background.paper",
              color: "text.primary",
              boxSizing: "border-box",
              borderRight: 0,
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
        }}
      >
        {/* Plan/Usage Overview */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            mb: 4,
            alignItems: { md: "center" },
          }}
        >
          <Box
            sx={{
              flex: 1,
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 3,
              boxShadow: 2,
              mb: { xs: 2, md: 0 },
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Plan: {usage.plan} {usage.plan === "Pro" && <LockIcon fontSize="small" sx={{ color: "gold", ml: 0.5 }} />}
              <Button
                size="small"
                variant="contained"
                color="secondary"
                sx={{ ml: 2, fontWeight: 600 }}
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
          </Box>
          <Box
            sx={{
              flex: 1,
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 3,
              boxShadow: 2,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Team Summary
            </Typography>
            <Typography variant="body2">
              Total Members: {usage.members}
            </Typography>
            <Typography variant="body2">
              Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Typography>
          </Box>
        </Box>

        {/* AI Snapshot & Announcements */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            mb: 4,
          }}
        >
          <Box
            sx={{
              flex: 1,
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 3,
              boxShadow: 2,
              mb: { xs: 2, md: 0 },
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              🧠 AI Snapshot
            </Typography>
            <Typography variant="body2">
              Last Prompt: "{usage.lastPrompt}"
              <IconButton size="small" sx={{ ml: 1 }}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 3,
              boxShadow: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <AnnouncementIcon color="primary" />
            <Typography variant="body2">
              📢 Announcements: Try the optimizer!
            </Typography>
          </Box>
        </Box>

        {/* Main routed content */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;