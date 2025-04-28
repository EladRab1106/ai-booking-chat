// src/api/businessApi.js
import axios from "axios";

const API_URL = "http://localhost:5050/api/businesses"; // ⬅️ נכון!! API של עסקים

export const createBusiness = async (businessData) => {
  try {
    const res = await axios.post(`${API_URL}`, businessData);
    console.log("🔄 Response from backend:", res.data);
    return res.data;
  } catch (err) {
    console.error(
      "❌ Failed to create business:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export const fetchBusinessById = async (businessId) => {
  const res = await axios.get(`${API_URL}/${businessId}`);
  return res.data;
};

export const fetchBusinessStats = async (businessId) => {
  const res = await axios.get(`${API_URL}/${businessId}/stats`);
  return res.data;
};

export const fetchBusinessRecommendations = async (businessId) => {
  const res = await axios.get(`${API_URL}/${businessId}/recommendations`);
  return res.data;
};
