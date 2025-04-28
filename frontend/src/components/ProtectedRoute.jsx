import React from "react";
import { Navigate } from "react-router-dom";
import { getBusinessIdFromToken } from "../utils/authUtils";

const ProtectedRoute = ({ children }) => {
  const businessId = getBusinessIdFromToken();
  
  if (!businessId) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
