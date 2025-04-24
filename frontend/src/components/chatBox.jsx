import React, { useState } from "react";
import "../css/ChatBox.css";
import { sendMessageToGPT } from "../api/chat";
import { fetchMostCommonService } from "../api/customers";
import { handleGPTActions } from "../services/chatHandlers";

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
      options: [{ label: "אני מעוניין לקבוע תור", value: "אני מעוניין לקבוע תור" }],
    },
  ]);
  const [appointmentMap, setAppointmentMap] = useState({});

  const showServiceOptions = () => {
    if (!businessData.services?.length) return;

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
      setAwaitingUserDetails(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "אנא ציין את שמך המלא ומספר הטלפון שלך כך: שם - טלפון\nלדוגמה: ישראל ישראלי - 0541234567",
        },
      ]);
    } else {
      fetchReply(messageToSend);
    }
  };

  const fetchReply = async (userMessage) => {
    try {
      setIsTyping(true);

      if (pendingPopularFlow && userMessage === "לא, בא לי משהו אחר") {
        setPendingPopularFlow(false);
        showServiceOptions();
        return;
      }

      if (awaitingUserDetails) {
        const [name, phone] = userMessage.split(" - ");
        if (!name || !phone) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "📌 פורמט לא תקין. נסה כך: שם - טלפון" },
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
              { role: "assistant", content: "לא מצאתי שירותים קודמים עליך. אנא בחר שירות:" },
            ]);
            showServiceOptions();
          }
        } catch (err) {
          console.error("❌ Error checking service:", err.message);
          setMessages((prev) => [...prev, { role: "assistant", content: "אירעה תקלה בזיהוי הלקוח. נסה שוב." }]);
        }
        return;
      }

      if (pendingPopularFlow && userMessage.toLowerCase().includes("כן")) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `📅 לאיזה תאריך או יום אתה רוצה לקבוע את ה-${suggestedService}?` },
        ]);
        setPendingPopularFlow(false);
        return;
      }

      const reply = await sendMessageToGPT(userMessage, businessData, messages, pendingCustomerName, pendingCustomerPhone);
      await handleGPTActions({
        reply,
        setMessages,
        businessData,
        suggestedService,
        setSuggestedService,
        appointmentMap,
        setAppointmentMap,
        pendingCustomerName,
        pendingCustomerPhone,
      });
    } catch (err) {
      console.error("❌ GPT Error:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "😔 אירעה תקלה. נסה שוב מאוחר יותר." }]);
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
