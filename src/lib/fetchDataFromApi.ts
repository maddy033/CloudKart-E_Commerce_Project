/**
 * Project: CloudKart
 * File: fetchDataFromApi.ts
 */

import axios from "axios";

// Browser requests use the current browser origin.
// Server-side requests inside Docker use the app service.
const baseURL =
  typeof window !== "undefined"
    ? `${window.location.origin}/api`
    : process.env.NEXT_PUBLIC_API_URL || "http://app:3000/api";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let token = null;

    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";");

      const tokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("token=")
      );

      token = tokenCookie
        ? decodeURIComponent(tokenCookie.split("=")[1].trim())
        : null;
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const fetchData = {
  get: async (url: string, params = {}) => {
    try {
      const response = await axiosInstance.get(url, {
        params,
      });

      return response;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },

  post: async (url: string, data = {}) => {
    try {
      const response = await axiosInstance.post(url, data);

      return response;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  },
};

export default fetchData;
