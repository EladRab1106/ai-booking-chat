import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LiatSalonChat from './pages/Chats/LiatSalonChat';
import NavBar from './components/NavBar';
import { devCreateBusiness } from './utils/devCreateBusiness';

function App() {
  const handleCreateBusiness = async () => {
    const id = await devCreateBusiness();
    alert("✅ Business created with ID: " + id);
  };

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/liat-salon" element={<LiatSalonChat />} />
        </Routes>

        {/* ⚙️ כפתור זמני למפתח בלבד */}
        <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
          <button onClick={handleCreateBusiness}>🚀 צור עסק לדוגמה</button>
        </div>
      </div>
    </Router>
  );
}

export default App;
