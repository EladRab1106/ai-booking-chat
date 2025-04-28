import React, { createContext, useContext, useState, useEffect } from "react";
import { getBusinessIdFromToken } from "../utils/authUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getBusinessIdFromToken());

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      setIsAuthenticated(!!token && !!getBusinessIdFromToken());
    };

    checkAuth();
    window.addEventListener("storage", checkAuth); // כדי שגם בכרטיסיות אחרות יתעדכן

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const login = (token) => {
    localStorage.setItem("accessToken", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 ייצוא של hook שימושי
export const useAuth = () => useContext(AuthContext);
