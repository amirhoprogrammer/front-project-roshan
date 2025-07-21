// src/config/apiConfig.js
import config from "./api_config.json";

export const BASE_URL = config.base_url;
export const API_KEY = process.env.REACT_APP_API_KEY || config.api_key; // اولویت با متغیر محیطی
export const ENDPOINTS = config.endpoints;
