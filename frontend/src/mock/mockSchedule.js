// src/mock/mockSchedule.js

// יומן תורים לדוגמה
const mockSchedule = {
    "2025-04-08": ["09:00", "10:30", "14:30", "16:00"],
    "2025-04-09": ["10:00", "13:00", "15:30"],
    "2025-04-10": ["09:30", "12:00", "17:00"],
  };
  
  // מפת טווחי זמן
  const timeRanges = {
    morning: ["08:00", "12:00"],
    afternoon: ["12:00", "16:00"],
    evening: ["16:00", "20:00"]
  };
  
  /**
   * בדיקת זמינות לפי תאריך + העדפת זמן
   */
  export function checkAvailability(date, preference) {
    const availableSlots = mockSchedule[date];
    if (!availableSlots || availableSlots.length === 0) return [];
  
    const [start, end] = timeRanges[preference] || ["00:00", "23:59"];
  
    const matchingSlots = availableSlots.filter(
      time => time >= start && time <= end
    );
  
    return matchingSlots;
  }
  
  
  /**
   * קביעת תור – מוחק את השעה מהלו״ז באותו תאריך
   */
  export function bookAppointment(date, time) {
    if (!mockSchedule[date]) return false;
  
    const index = mockSchedule[date].indexOf(time);
    if (index === -1) return false;
  
    // מחק את השעה
    mockSchedule[date].splice(index, 1);
    return true;
  }
  
  /**
   * בדיקה: אפשר להוסיף פונקציה שמחזירה את הלו״ז לצורך ניתוח בהמשך
   */
  export function getSchedule() {
    return mockSchedule;
  }
  