import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import LiatSalonChat from "./pages/Chats/LiatSalonChat";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import { devCreateBusiness } from "./utils/devCreateBusiness";
import Signup from "./pages/SignUp";
import BusinessProfile from "./components/BusinessProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext"; // ⬅️ ייבוא ה-AuthProvider

function App() {
  const handleCreateBusiness = async () => {
    const id = await devCreateBusiness();
    alert("✅ Business created with ID: " + id);
  };

  return (
    <Router>
      <AuthProvider> {/* ⬅️ עוטפים את כל האפליקציה */}
        <div className="App">
          <NavBar />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/liat-salon" element={<LiatSalonChat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<Signup />} />

            {/* 🔒 עמוד פרופיל שמוגן */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <BusinessProfile />
                </ProtectedRoute>
              }
            />
          </Routes>

          {/* ⚙️ כפתור זמני למפתחים */}
          {/* 
          <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
            <button onClick={handleCreateBusiness}>🚀 צור עסק לדוגמה</button>
          </div> 
          */}
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
