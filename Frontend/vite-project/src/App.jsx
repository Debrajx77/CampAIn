import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
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
import OrganizationAndTeamPage from "./Routes/OrganizationAndTeamPage";
import Billing from "./components/Billing";
import DashboardLayout from "./components/DashboardLayout";
import "./index.css";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
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
          <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/campaigns" element={<CampaignList />} />
            <Route path="/create-campaign" element={<CreateCampaign />} />
            <Route path="/calendar" element={<CampaignCalendar />} />
            <Route path="/email-campaign" element={<EmailCampaign />} />
            <Route path="/budget-management" element={<BudgetManagement />} />
            <Route path="/analytics" element={<CampaignAnalytics />} />
            <Route path="/optimization" element={<CampaignOptimization />} />
            <Route path="/org-team" element={<OrganizationAndTeamPage />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route
            path="/edit-campaign/:id"
            element={
              <PrivateRoute>
                <EditCampaign />
              </PrivateRoute>
            }
          />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
