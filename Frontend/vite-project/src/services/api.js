// src/services/api.js (example)
import axios from "axios";
import "./styles.css"; // Import your CSS file

const api = axios.create({
  baseURL: "https://campain-b2rr.onrender.com/api", // <-- not localhost
  withCredentials: true,
});

export default api; // src/services/api.js (example additions)

export const getOrganization = async () => {
  try {
    const response = await api.get("/organization");
    return response.data;
  } catch (error) {
    console.error("Error fetching organization:", error);
    throw error;
  }
};

export const getTeam = async () => {
  try {
    const response = await api.get("/team/view");
    return response.data;
  } catch (error) {
    console.error("Error fetching team:", error);
    throw error;
  }
};

const API_URL = "https://campain-b2rr.onrender.com"; // Replace with your backend URL

export const signup = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getAnalytics = async () => {
  try {
    const response = await axios.get(`${API_URL}/campaigns/analytics`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const login = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createCampaign = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/create-campaign`, data);
    // Dispatch a custom event for campaign creation
    window.dispatchEvent(
      new CustomEvent("campaignCreated", { detail: response.data })
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getCampaigns = async () => {
  try {
    const response = await axios.get(`${API_URL}/campaigns`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getBudgets = async () => {
  try {
    const response = await axios.get(`${API_URL}/campaigns/budgets`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getCalendarData = async () => {
  try {
    const response = await axios.get(`${API_URL}/campaigns/calendar`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
