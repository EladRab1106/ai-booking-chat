import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="homepage min-h-screen bg-gradient-to-b from-indigo-100 via-white to-indigo-200 flex flex-col items-center justify-center text-center px-6 py-12 space-y-12">
      {/* גיבור */}
      <section className="hero space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-700">
          BookMate
        </h1>
        <h2 className="text-2xl md:text-3xl text-gray-700 font-semibold">
          העסק שלך. העוזר החכם שלך. פשוט, מהיר וחכם 💡
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          לא רק קביעת תורים – כל מה שהלקוחות שלך צריכים, בצ'אט אחד ידידותי.
        </p>
      </section>

      {/* כפתור התחל עכשיו – ממורכז בין הסקשנים */}
      <section className="my-6">
        <Link to="/liat-salon">
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-full text-lg shadow-lg hover:bg-indigo-700 transition">
            התחל עכשיו
          </button>
        </Link>
      </section>

      {/* פיצ'רים */}
      <section
        className="features w-full max-w-3xl p-8 bg-gradient-to-br from-indigo-50 via-white to-purple-100 rounded-3xl shadow-2xl border border-indigo-200 space-y-6"
        dir="rtl"
      >
        <div className="flex items-center gap-3">
          <div className="w-1 h-10 bg-indigo-500 rounded-full"></div>
          <h2 className="text-3xl font-extrabold text-indigo-800">
            למה לעבוד איתנו?
          </h2>
        </div>

        <ul className="text-lg leading-relaxed text-gray-800 space-y-4 text-right">
          <li className="flex items-start gap-2">
            <span className="text-2xl">💬</span>
            <span>קביעת תורים בשיחה טבעית עם הבינה המלאכותית</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-2xl">📲</span>
            <span>בלי אפליקציות. בלי הורדות. רק קישור אחד פשוט</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-2xl">🧠</span>
            <span>AI שמבין את הלקוחות שלך כמו עוזר אמיתי</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-2xl">📊</span>
            <span>תכיר את הקבועים שלך – ותגביר נאמנות אוטומטית</span>
          </li>
        </ul>
      </section>

      {/* קריאה לפעולה */}
      <section className="cta space-y-4">
        <h3 className="text-xl text-gray-700 font-semibold">
          מושלם לכל עסק קטן – מספרות, טיפוח, חנויות אופנה ועוד 🎯
        </h3>
        <button className="bg-pink-500 text-white px-6 py-3 rounded-full text-lg hover:bg-pink-600 transition shadow-lg">
          דברו איתנו
        </button>
      </section>
    </div>
  );
}

export default HomePage;
