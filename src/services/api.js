// src/services/api.js
import axios from "axios";
import { BASE_URL, API_KEY, ENDPOINTS } from "../config/apiConfig";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
});

export const getUsers = async () => {
  try {
    const response = await apiClient.get(ENDPOINTS.get_users);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await apiClient.post(ENDPOINTS.create_user, userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
