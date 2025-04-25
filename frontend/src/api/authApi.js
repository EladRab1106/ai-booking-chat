// src/api/authApi.js
import axios from "axios";

const API_URL = "http://localhost:5050/api/users";

export const login = async (email, password) => {
  const res = await axios.post(
    `${API_URL}/login`,
    { email, password },
    { withCredentials: true }
  );
  return res.data.accessToken;
};

export const register = async (businessName, email, password) => {
  const res = await axios.post(`${API_URL}/register`, {
    businessName,
    email,
    password,
  });
  return res.data;
};

export const getMyProfile = async (accessToken) => {
  const res = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });
  return res.data;
};

export const refreshAccessToken = async () => {
  const res = await axios.get(`${API_URL}/refresh`, {
    withCredentials: true,
  });
  return res.data.accessToken;
};

export const logout = async () => {
  await axios.post(`${API_URL}/logout`, null, {
    withCredentials: true,
  });
};
