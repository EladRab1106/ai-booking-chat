import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { cancelAppointment } from "../api/appointments";

function CancelAppointment() {
  const { id } = useParams(); // ⬅️ תופס את ה-id מה-URL
  const [status, setStatus] = useState("waiting"); // waiting / loading / success / error

  const handleCancel = async () => {
    setStatus("loading");
    try {
      await cancelAppointment(id);
      setStatus("success");
    } catch (err) {
      console.error("Cancel error:", err.message);
      setStatus("error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-xl p-8 text-center space-y-6">
        {status === "waiting" && (
          <>
            <h1 className="text-2xl font-bold text-gray-800">
              האם אתה בטוח שברצונך לבטל את התור?
            </h1>
            <button
              onClick={handleCancel}
              className="mt-6 bg-red-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-red-600 transition"
            >
              כן, בטל את התור
            </button>
          </>
        )}
        {status === "loading" && (
          <p className="text-lg font-semibold text-indigo-600">מבטל את התור...</p>
        )}
        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-green-600">התור בוטל בהצלחה ✅</h1>
            <p className="text-gray-600 mt-2">נשמח לראות אותך שוב בעתיד!</p>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-600">שגיאה בביטול 😥</h1>
            <p className="text-gray-600 mt-2">נא לנסות שוב מאוחר יותר או ליצור קשר עם העסק.</p>
          </>
        )}
      </div>
    </div>
  );
}

export default CancelAppointment;
