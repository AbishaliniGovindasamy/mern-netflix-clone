import axios from "axios";
import axiosRetry from "axios-retry";
import { ENV_VARS } from "../config/envVars.js";

const axiosInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 30000, // Increased timeout
  headers: {
    Authorization: `Bearer ${ENV_VARS.TMDB_API_KEY}`,
    "Content-Type": "application/json",
  },
});

axiosRetry(axiosInstance, {
  retries: 3, // Retry up to 3 times
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkError(error) ||
           error.code === "ECONNRESET" ||
           error.message.includes("timeout");
  },
});

export async function fetchFromTMDB(endpoint) {
  try {
    console.log(`Fetching from TMDB: ${endpoint}`);
    const response = await axiosInstance.get(endpoint);
    console.log(`✅ TMDB API Response: Success (${response.status})`);
    return response.data;
  } catch (error) {
    console.error("🔥 TMDB API Error:", error.response?.data || error.message);
    throw error;
  }
}
