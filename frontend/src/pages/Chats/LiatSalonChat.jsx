// /frontend/src/pages/Chats/LiatSalonChat.jsx
import React, { useEffect, useState } from 'react';
import ChatBox from '../../components/chatBox';
import axios from 'axios';

function LiatSalonChat() {
  const [businessData, setBusinessData] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/businesses/680670b67b156572c146e9b3');
        setBusinessData(res.data);
      } catch (err) {
        console.error("❌ Failed to load business:", err.message);
      }
    };

    fetchBusiness();
  }, []);

  if (!businessData) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-violet-200 via-white to-rose-100">
      <p className="text-lg text-gray-700 font-medium animate-pulse">טוען את נתוני העסק...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-purple-200 flex flex-col items-center py-12 px-4">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500 drop-shadow mb-4 animate-fade-in">
        {businessData.name}
      </h1>
  
      <p className="text-lg text-gray-600 mb-8 max-w-xl text-center animate-fade-in delay-200">
        כאן תוכל להזמין תור, לקבל המלצות על שירותים או להתייעץ עם העוזר החכם שלנו – 24/7 💇‍♀️💬
      </p>
  
      <div className="w-full max-w-3xl shadow-2xl rounded-3xl bg-white border border-gray-200 animate-fade-in delay-300">
        <ChatBox businessData={businessData} />
      </div>
    </div>
  );
  
}

export default LiatSalonChat;
