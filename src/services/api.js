// src/services/api.js
import axios from "axios";
import { BASE_URL, API_TOKEN } from "../config/apiConfig";
const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    Authorization: `Token ${API_TOKEN}`,
    "Content-Type": "application/json",
  },
});
// تبدیل صوت/ویدئو به متن
export const transcribeFiles = async (mediaUrls) => {
  try {
    const response = await apiClient.post("/transcribe_files/", { media_urls: mediaUrls });
    return response.data;
  } catch (error) {
    console.error("Error transcribing files:", error);
    throw error;
  }
};
// دریافت لیست درخواست‌ها
export const getRequests = async () => {
  try {
    const response = await apiClient.get("/requests/");
    return response.data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }
};

// دریافت تصویر رسانه
export const getMediaImage = async (mediaUrl) => {
  try {
    const response = await apiClient.get(`/media_image/${mediaUrl}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching media image:", error);
    throw error;
  }
};

// جستجو
export const search = async (query) => {
  try {
    const response = await apiClient.post("/search/", { query });
    return response.data;
  } catch (error) {
    console.error("Error searching:", error);
    throw error;
  }
};

// دریافت جزئیات درخواست
export const getRequestDetail = async (id) => {
  try {
    const response = await apiClient.get(`/requests/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching request detail:", error);
    throw error;
  }
};

// حذف درخواست
export const deleteRequest = async (id) => {
  try {
    const response = await apiClient.delete(`/requests/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting request:", error);
    throw error;
  }
};
