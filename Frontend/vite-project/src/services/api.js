// src/services/api.js (example)
import axios from "axios";

const API_URL = "https://campain-2.onrender.com"; // Replace with your backend URL

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
// src/services/api.js

import axios from "axios";

const API_URL = "https://campain-2.onrender.com"; // Replace with your backend URL

// Socket API Endpoints

export const connectSocket = async () => {
  try {
    const response = await axios.get(`${API_URL}/socket/connect`);
    return response.data;
  } catch (error) {
    console.error("Error connecting to socket:", error);
    throw error;
  }
};

export const sendMessage = async (message) => {
  try {
    const response = await axios.post(`${API_URL}/socket/send`, { message });
    return response.data;
  } catch (error) {
    console.error("Error sending message through socket:", error);
    throw error;
  }
};

export const receiveMessage = async () => {
  try {
    const response = await axios.get(`${API_URL}/socket/receive`);
    return response.data;
  } catch (error) {
    console.error("Error receiving message from socket:", error);
    throw error;
  }
};

export const closeSocket = async () => {
  try {
    const response = await axios.delete(`${API_URL}/socket/close`);
    return response.data;
  } catch (error) {
    console.error("Error closing socket connection:", error);
    throw error;
  }
};
export const login = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createCampaign = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/create-campaign`, data);
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
