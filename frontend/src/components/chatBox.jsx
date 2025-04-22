import React, { useState } from "react";
import "../css/ChatBox.css";
import { sendMessageToGPT } from "../api/chat";
import {
  fetchAvailableAppointments,
  bookAppointmentAPI,
} from "../api/appointments";

function removeJsonFromText(text) {
  return text.replace(/```json\s*[\s\S]*?```/g, "").trim();
}

function extractJsonFromText(text) {
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/g;
  const matches = [];
  let match;

  while ((match = jsonRegex.exec(text)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      matches.push(parsed);
    } catch (err) {
      console.error("❌ Failed to parse JSON block:", err);
    }
  }

  return matches;
}

function ChatBox({ businessData }) {
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `שלום! אני העוזר החכם של ${businessData.name}. איך אפשר לעזור היום?`,
    },
  ]);
  const [appointmentMap, setAppointmentMap] = useState({}); // זמן > מזהה

  const handleSend = (customMessage) => {
    const messageToSend = customMessage || input.trim();
    if (!messageToSend) return;

    setMessages((prev) => [...prev, { role: "user", content: messageToSend }]);
    setInput("");
    fetchReply(messageToSend);
  };

  const fetchReply = async (userMessage) => {
    try {
      setIsTyping(true);

      const reply = await sendMessageToGPT(userMessage, businessData, messages);
      console.log("🧠 Full GPT reply:", reply);
      const cleanReply = removeJsonFromText(reply);
      setMessages((prev) => [...prev, { role: "assistant", content: cleanReply }]);

      const actions = extractJsonFromText(reply);
      console.log("📦 Parsed JSON actions:", actions);

      for (const action of actions) {
        if (action.action === "check_availability") {
          const { date, time_preference } = action;
          const allAvailable = await fetchAvailableAppointments(businessData._id, date);

          const filtered = allAvailable.filter((appt) => {
            const hour = parseInt(appt.time.split(":")[0], 10);
            if (time_preference === "morning") return hour >= 8 && hour < 12;
            if (time_preference === "afternoon") return hour >= 12 && hour < 17;
            if (time_preference === "evening") return hour >= 17 && hour <= 20;
            return true;
          });

          const map = {};
          filtered.forEach((appt) => {
            map[appt.time] = appt._id;
          });
          setAppointmentMap(map);

          if (filtered.length > 0) {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                type: "buttons",
                content: `🕐 הנה השעות הפנויות ב-${date} (${time_preference}):`,
                options: filtered.map((a) => ({
                  label: a.time,
                  value: `אני רוצה לקבוע ל-${a.time}`,
                })),
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: `😔 אין שעות פנויות ב-${date} בטווח הזמן: ${time_preference}.`,
              },
            ]);
          }
        }

        if (action.action === "book_appointment") {
          const { time, name, phone } = action;
          const appointmentId = appointmentMap[time];

          if (!appointmentId) {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: "⚠️ לא מצאתי את התור הרצוי. נסה לבדוק זמינות מחדש.",
              },
            ]);
            return;
          }

          if (!name || !phone || name.includes("השם") || phone.includes("מספר")) {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content:
                  "כדי לקבוע את התור אני צריך את שמך המלא ומספר הטלפון שלך.\nכתוב כך: שם - מספר טלפון\nלמשל: אלעד רבינוביץ - 0521234567",
              },
            ]);
            return;
          }

          try {
            const updated = await bookAppointmentAPI({
              appointmentId,
              name,
              phone,
              businessId: businessData._id,
            });

            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: `✅ קבעתי לך תור ל-${updated.service} ביום ${updated.date} בשעה ${updated.time}.`,
              },
            ]);
          } catch (err) {
            console.error("❌ Booking failed:", err.message);
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: "⚠️ לא הצלחתי לקבוע את התור. נסה שוב או בדוק זמינות.",
              },
            ]);
          }
        }
      }
    } catch (err) {
      console.error("❌ GPT Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "😔 אירעה תקלה. נסה שוב מאוחר יותר.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbox">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-msg ${msg.role}`}>
            {msg.type === "buttons" ? (
              <>
                <div>{msg.content}</div>
                <div className="button-options">
                  {msg.options.map((opt, i) => (
                    <button key={i} onClick={() => handleSend(opt.value)}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              msg.content
            )}
          </div>
        ))}
        {isTyping && <div className="chat-msg assistant typing">העוזר החכם מקליד...</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="הקלד הודעה..."
        />
        <button onClick={() => handleSend()}>שלח</button>
      </div>
    </div>
  );
}

export default ChatBox;
