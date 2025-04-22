import axios from "axios";

const API_BASE = "http://localhost:5050/api"; // תוודא שזה הפורט של השרת שלך

export const fetchMostCommonService = async (phone, businessId) => {
  const res = await axios.get(`${API_BASE}/customers/common-service`, {
    params: { phone, businessId }
  });
  return res.data.mostCommonService;
};
