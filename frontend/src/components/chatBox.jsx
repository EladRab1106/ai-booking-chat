import React, { useState } from "react";
import "../css/ChatBox.css";
import { sendMessageToGPT } from "../api/chat";
import {
  fetchAvailableAppointments,
  bookAppointmentAPI,
} from "../api/appointments";
import { fetchMostCommonService } from "../api/customers";

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
  const [awaitingUserDetails, setAwaitingUserDetails] = useState(false);
  const [pendingPopularFlow, setPendingPopularFlow] = useState(false);
  const [suggestedService, setSuggestedService] = useState(null);
  const [pendingCustomerName, setPendingCustomerName] = useState("");
  const [pendingCustomerPhone, setPendingCustomerPhone] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `שלום! אני העוזר החכם של ${businessData.name}. איך אפשר לעזור היום?`,
    },
    {
      role: "assistant",
      type: "buttons",
      content: "📅 רוצה לקבוע תור?",
      options: [
        {
          label: "אני מעוניין לקבוע תור",
          value: "אני מעוניין לקבוע תור",
        },
      ],
    },
  ]);
  const [appointmentMap, setAppointmentMap] = useState({});

  const showServiceOptions = () => {
    if (!businessData.services || businessData.services.length === 0) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        type: "buttons",
        content: "בחר שירות מתוך האפשרויות הבאות:",
        options: businessData.services.map((s) => ({
          label: s.name,
          value: s.name,
        })),
      },
    ]);
  };

  const handleSend = (customMessage) => {
    const messageToSend = customMessage || input.trim();
    if (!messageToSend) return;

    setMessages((prev) => [...prev, { role: "user", content: messageToSend }]);
    setInput("");

    if (messageToSend === "אני מעוניין לקבוע תור") {
      setAwaitingUserDetails(true); // הפעלת זרימת לקוח חוזר
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "אנא ציין את שמך המלא ומספר הטלפון שלך כך: שם - טלפון\nלדוגמה: ישראל ישראלי - 0541234567",
        },
      ]);
    } else {
      fetchReply(messageToSend);
    }
  };

  const fetchReply = async (userMessage) => {
    try {
      if (pendingPopularFlow && userMessage === "לא, בא לי משהו אחר") {
        setPendingPopularFlow(false);
        showServiceOptions();
        return;
      }
      setIsTyping(true);

      // שלב 1: קבלת פרטי לקוח
      if (awaitingUserDetails) {
        const [name, phone] = userMessage.split(" - ");
        if (!name || !phone) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "📌 פורמט לא תקין. אנא כתוב שוב כך: שם - טלפון",
            },
          ]);
          return;
        }

        setPendingCustomerName(name);
        setPendingCustomerPhone(phone);
        setAwaitingUserDetails(false);

        try {
          const data = await fetchMostCommonService(phone, businessData._id);
          if (data) {
            setSuggestedService(data);
            setPendingPopularFlow(true);
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                type: "buttons",
                content: `שלום ${name}, האם להזמין לך תור ל-${data} שוב?`,
                options: [
                  { label: "כן", value: "כן" },
                  { label: "לא, בא לי משהו אחר", value: "לא, בא לי משהו אחר" },
                ],
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content:
                  "לא מצאתי שירותים קודמים עליך. תוכל לרשום איזה שירות אתה מחפש?",
              },
            ]);
            showServiceOptions();
          }
        } catch (err) {
          console.error("❌ Error checking service:", err.message);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "אירעה תקלה בזיהוי הלקוח. נסה שוב.",
            },
          ]);
        }

        return;
      }

      // שלב 2: אישור שירות פופולרי
      if (pendingPopularFlow && userMessage.toLowerCase().includes("כן")) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `📅 איזה תאריך או יום אתה מעוניין לקבוע את ה-${suggestedService}?`,
          },
        ]);
        setPendingPopularFlow(false);
        return;
      }

      if (!pendingPopularFlow && !suggestedService && businessData.services) {
        for (const service of businessData.services) {
          if (userMessage.includes(service.name)) {
            setSuggestedService(service.name);
            break;
          }
        }
      }

      // שלב 3: המשך רגיל עם GPT
      const reply = await sendMessageToGPT(
        userMessage,
        businessData,
        messages,
        pendingCustomerName,
        pendingCustomerPhone
      );
      console.log("🧠 Full GPT reply:", reply);

      const cleanReply = removeJsonFromText(reply);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: cleanReply },
      ]);

      const actions = extractJsonFromText(reply);
      console.log("📦 Parsed JSON actions:", actions);

      for (const action of actions) {
        if (action.action === "check_availability") {
          if (action.service) {
            setSuggestedService(action.service);
          }

          const { date, time_preference, service } = action;
          const allAvailable = await fetchAvailableAppointments(
            businessData._id,
            date,
            service || suggestedService
          );

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
          const { time } = action;
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

          // נשתמש בפרטים השמורים אם GPT לא סיפק אותם כראוי
          let name = action.name;
          let phone = action.phone;

          if (!name || name.includes("השם")) {
            name = pendingCustomerName;
          }
          if (!phone || phone.includes("מספר")) {
            phone = pendingCustomerPhone;
          }

          // אם עדיין חסרים פרטים – בקש שוב
          if (!name || !phone) {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content:
                  "כדי לקבוע את התור אני צריך את שמך המלא ומספר הטלפון שלך.\nכתוב כך: שם - מספר טלפון\nלמשל: ישראל ישראלי - 0541234567",
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
              service: action.service,
            });

            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: `✅ קבעתי לך תור ל-${updated.service} ביום ${updated.date} בשעה ${updated.time}.\nתודה רבה ${name}! נשמח לראותך 😊`,
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
        {isTyping && (
          <div className="chat-msg assistant typing">העוזר החכם מקליד...</div>
        )}
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
