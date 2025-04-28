import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBusinessIdFromToken } from "../utils/authUtils";
import { fetchBusinessById, fetchBusinessStats, fetchBusinessRecommendations } from "../api/business";

function BusinessProfile() {
  const [business, setBusiness] = useState(null);
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const businessId = getBusinessIdFromToken();

  useEffect(() => {
    if (!businessId) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const businessRes = await fetchBusinessById(businessId);
        setBusiness(businessRes);

        const statsRes = await fetchBusinessStats(businessId);
        setStats(statsRes);

        const recoRes = await fetchBusinessRecommendations(businessId);
        setRecommendations(recoRes);

        setLoading(false);
      } catch (err) {
        console.error("Error loading business profile:", err.message);
        navigate("/login");
      }
    };

    fetchData();
  }, [businessId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
        טוען...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-indigo-700">{business.name}</h1>
        <p className="mt-2 text-gray-500">ברוך הבא ללוח הבקרה של העסק שלך ✨</p>
      </div>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
          <span className="text-indigo-600 text-4xl mb-2">📅</span>
          <p className="text-lg font-semibold">סך כל התורים</p>
          <p className="text-2xl text-gray-800 mt-2">{stats.totalAppointments}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
          <span className="text-green-500 text-4xl mb-2">💰</span>
          <p className="text-lg font-semibold">סך הכנסות</p>
          <p className="text-2xl text-gray-800 mt-2">₪{stats.totalRevenue}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
          <span className="text-yellow-500 text-4xl mb-2">💎</span>
          <p className="text-lg font-semibold">ערך ממוצע ללקוח</p>
          <p className="text-2xl text-gray-800 mt-2">₪{stats.avgCustomerValue}</p>
        </div>
      </div>

      {/* המלצות לשיפור */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">📈 המלצות לצמיחה</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {recommendations.map((rec, idx) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BusinessProfile;
