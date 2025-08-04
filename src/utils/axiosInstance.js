import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7088/api",
});

// Auto-add token to headers
axiosInstance.interceptors.request.use((config) => {
    debugger;
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
