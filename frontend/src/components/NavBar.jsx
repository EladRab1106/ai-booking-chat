import React from 'react';
import { useNavigate } from "react-router-dom";
import { logout as logoutAPI } from "../api/authApi";
import { useAuth } from "../context/AuthContext"; // ⬅️ ייבוא של ה־AuthContext

function NavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth(); // ⬅️ שימוש ב־useAuth()

  const handleLogout = async () => {
    try {
      await logoutAPI(); // מחיקה מהשרת
      logout();           // מחיקה מה־context
      navigate("/login"); // מעביר למסך התחברות
    } catch (err) {
      console.error("Logout error:", err);
      // אפשר להוסיף טוסטר של שגיאת התנתקות
    }
  };

  return (
    <nav className="bg-indigo-600 p-4 flex justify-between items-center shadow-md">
      <div 
        className="text-white font-bold text-2xl cursor-pointer hover:text-indigo-300 transition"
        onClick={() => navigate("/")}
      >
        BookMate
      </div>

      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <button 
            className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-full shadow hover:bg-indigo-100 transition"
            onClick={() => navigate("/login")}
          >
            Business Login
          </button>
        ) : (
          <>
            <button 
              className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-full shadow hover:bg-indigo-100 transition"
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>
            <button 
              className="bg-red-500 text-white font-semibold px-4 py-2 rounded-full shadow hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
