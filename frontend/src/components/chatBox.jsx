import React, { useState } from "react";
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
      content: `${businessData.name} שלום, אני העוזר החכם של `
    },
    {
      role: "assistant",
      type: "buttons",
      content:"?רוצה לקבוע תור 📅",
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

      const reply = await sendMessageToGPT(
        userMessage,
        businessData,
        messages,
        pendingCustomerName,
        pendingCustomerPhone
      );

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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "😔 אירעה תקלה. נסה שוב מאוחר יותר." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // ChatBox.jsx (רק הקטע של ה-return)
return (
  <div className="chatbox w-full h-[75vh] max-w-3xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden flex flex-col border border-purple-300 dir = rtl:">
    <div className="chat-messages flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50 via-white to-pink-50">
      {messages.map((msg, index) => (
        <div key={index} className={`chat-msg ${msg.role === "user" ? "text-right" : "text-left"}`}>
          {msg.type === "buttons" ? (
            <>
              <div className="mb-2 text-purple-800 font-semibold">{msg.content}</div>
              <div className="flex flex-wrap gap-2 justify-start">
                {msg.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(opt.value)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow hover:scale-105 transition-transform duration-200"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div
              className={`inline-block px-4 py-3 rounded-2xl max-w-xs ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white ml-auto"
                  : "bg-purple-100 text-gray-900 mr-auto"
              }`}
            >
              {msg.content}
            </div>
          )}
        </div>
      ))}
      {isTyping && <div className="text-gray-500 text-sm animate-pulse">העוזר החכם מקליד...</div>}
    </div>

    <div className="chat-input flex items-center p-4 bg-white border-t border-purple-200">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="הקלד הודעה..."
        className="flex-1 px-4 py-3 border border-purple-300 rounded-l-xl outline-none focus:ring-2 focus:ring-purple-400"
      />
      <button
        onClick={() => handleSend()}
        className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-r-xl hover:opacity-90 transition"
      >
        שלח
      </button>
    </div>
  </div>
);

}

export default ChatBox;
