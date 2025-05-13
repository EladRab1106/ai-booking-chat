import axios from "axios";

const API = "http://localhost:5050/api/appointments";

// 🟢 שליפת תורים פנויים לעסק ולתאריך מסוים
export const fetchAvailableAppointments = async (businessId, date, service) => {
  const res = await axios.get(`${API}/business/${businessId}/available`, {
    params: { date, service },
  });
  return res.data;
};

// 🟢 קביעת תור בפועל (כולל יצירת לקוח אם צריך)
export const bookAppointmentAPI = async ({ appointmentId, name, phone, businessId, service }) => {
  const res = await axios.patch(`${API}/${appointmentId}/book`, {
    name,
    phone,
    businessId,
    service, // ✅ עכשיו אתה שולח את השירות לשרת
  });
  return res.data;
};

// ❌ ביטול תור לפי ID
export const cancelAppointment = async (appointmentId) => {
  const res = await axios.patch(`${API}/${appointmentId}/cancel`);
  return res.data;
};
