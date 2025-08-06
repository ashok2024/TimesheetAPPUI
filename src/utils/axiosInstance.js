// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7088/api",
});

// Always read the latest token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    debugger;
    const token = localStorage.getItem("token");
    console.log("Token being sent in Axios:", token); // ✅ check this
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
