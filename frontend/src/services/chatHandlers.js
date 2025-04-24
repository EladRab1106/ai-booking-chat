import { fetchAvailableAppointments, bookAppointmentAPI } from "../api/appointments";
import { removeJsonFromText, extractJsonFromText } from "../utils/chatUtils";

export async function handleGPTActions({
  reply,
  setMessages,
  businessData,
  suggestedService,
  setSuggestedService,
  appointmentMap,
  setAppointmentMap,
  pendingCustomerName,
  pendingCustomerPhone
}) {
  const cleanReply = removeJsonFromText(reply);
  setMessages((prev) => [...prev, { role: "assistant", content: cleanReply }]);

  const actions = extractJsonFromText(reply);
  for (const action of actions) {
    if (action.action === "check_availability") {
      const { date, time_preference, service } = action;
      if (service) setSuggestedService(service);

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
      filtered.forEach((appt) => (map[appt.time] = appt._id));
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
      const { time, name, phone, service } = action;
      const appointmentId = appointmentMap[time];
      const finalName = name?.includes("השם") ? pendingCustomerName : name || pendingCustomerName;
      const finalPhone = phone?.includes("מספר") ? pendingCustomerPhone : phone || pendingCustomerPhone;

      if (!finalName || !finalPhone) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "כדי לקבוע את התור אני צריך את שמך המלא ומספר הטלפון שלך.\nכתוב כך: שם - מספר טלפון\nלמשל: ישראל ישראלי - 0541234567",
          },
        ]);
        return;
      }

      try {
        const updated = await bookAppointmentAPI({
          appointmentId,
          name: finalName,
          phone: finalPhone,
          businessId: businessData._id,
          service,
        });

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `✅ קבעתי לך תור ל-${updated.service} ביום ${updated.date} בשעה ${updated.time}.\nתודה רבה ${finalName}! נשמח לראותך 😊`,
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
}
