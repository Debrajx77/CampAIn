import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles"; // Importing necessary components
import SignIn from "./Routes/SignIn";
import SignUp from "./Routes/SignUp";
import Dashboard from "./Routes/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import CreateCampaign from "./Routes/CreateCampaign";
import CampaignList from "./Routes/CampaignList";
import EditCampaign from "./Routes/EditCampaign";
import CampaignDetails from "./Routes/CampaignDetails";
import CampaignAnalytics from "./Routes/CampaignAnalytics";
import Navigation from "./components/Navigation";
import EmailCampaign from "./Routes/EmailCampaign";
import CampaignCalendar from "./Routes/CampaignCalendar";
import BudgetManagement from "./Routes/BudgetManagement";
import CampaignOptimization from "./Routes/CampaignOptimization";
import "./index.css";

// Creating a custom theme
const theme = createTheme({
  palette: {
    mode: "dark", // dark mode theme
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#121212", // Dark background
      paper: "#1e1e1e", // Dark paper
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
});

const AppContent = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/", "/signup"];

  return (
    <div>
      {!hideNavbarPaths.includes(location.pathname) && <Navigation />}
      <div style={{ paddingTop: "6rem" }}>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-campaign"
            element={
              <PrivateRoute>
                <CreateCampaign />
              </PrivateRoute>
            }
          />
          <Route
            path="/campaigns"
            element={
              <PrivateRoute>
                <CampaignList />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-campaign/:id"
            element={
              <PrivateRoute>
                <EditCampaign />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <CampaignAnalytics />
              </PrivateRoute>
            }
          />
          <Route
            path="/email-campaign"
            element={
              <PrivateRoute>
                <EmailCampaign />
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <CampaignCalendar />
              </PrivateRoute>
            }
          />
          <Route
            path="/budget-management"
            element={
              <PrivateRoute>
                <BudgetManagement />
              </PrivateRoute>
            }
          />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
          <Route
            path="/campaign/:id/optimize"
            element={
              <PrivateRoute>
                <CampaignOptimization />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {" "}
        {/* Wrapping with ThemeProvider */}
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
