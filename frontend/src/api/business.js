import axios from "axios";

const API_BASE = "http://localhost:5050/api";

export const createBusiness = async (businessData) => {
  try {
    const res = await axios.post(`${API_BASE}/businesses`, businessData);
    console.log("🔄 Response from backend:", res.data); // ← חשוב כדי לבדוק את המידע שמוחזר
    return res.data;
  } catch (err) {
    console.error(
      "❌ Failed to create business:",
      err.response?.data || err.message
    );
    throw err;
  }
};
