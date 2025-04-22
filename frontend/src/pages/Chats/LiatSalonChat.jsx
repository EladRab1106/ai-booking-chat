// /frontend/src/pages/Chats/LiatSalonChat.jsx
import React, { useEffect, useState } from 'react';
import ChatBox from '../../components/chatBox';
import axios from 'axios';

function LiatSalonChat() {
  const [businessData, setBusinessData] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/businesses/680670b67b156572c146e9b3'); // ← תוודא שזה ה־ID הנכון
        setBusinessData(res.data);
      } catch (err) {
        console.error("❌ Failed to load business:", err.message);
      }
    };

    fetchBusiness();
  }, []);

  if (!businessData) return <div>טוען את נתוני העסק...</div>;

  return (
    <div>
      <ChatBox businessData={businessData} />
    </div>
  );
}

export default LiatSalonChat;
