import axios from "axios";

const API_URL = "https://localhost:7088/api";

export const login = async (username, password) => {
  return axios.post(`${API_URL}/auth/login`, { username, password });
  
};

export const getCurrentUser = async (token) => {
  return axios.get(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const registerUser = async (data) => {
  return axios.post(`${API_URL}/auth/register`, data);
};
