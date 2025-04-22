// src/api/appointments.js
import axios from "axios";

const API = "http://localhost:5050/api/appointments";

// 🟢 שליפת תורים פנויים לעסק ולתאריך מסוים
export const fetchAvailableAppointments = async (businessId, date) => {
    const res = await axios.get(`${API}/business/${businessId}/available`);
    const allAppointments = res.data;
  
    return allAppointments.filter(appt => appt.date === date);
  };
  

// 🟢 קביעת תור בפועל (כולל יצירת לקוח אם צריך)
export const bookAppointmentAPI = async ({ appointmentId, name, phone, businessId }) => {
  const res = await axios.patch(`${API}/${appointmentId}/book`, {
    name,
    phone,
    businessId,
  });
  return res.data;
};
