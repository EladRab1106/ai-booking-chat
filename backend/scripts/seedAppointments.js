// backend/scripts/seedAppointments.js
const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' }); // ← תיקון חשוב
const Appointment = require('../models/Appointment');

const MONGO_URI = process.env.MONGO_URI;

async function seedAppointments(businessId) {
  if (!businessId) {
    console.error("❌ Please provide a business ID as an argument");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log('🔌 Connected to MongoDB');

  const appointments = [];
  const startHour = 9;
  const endHour = 19;
  const interval = 30;
  const today = new Date();

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + dayOffset);

    if (currentDate.getDay() === 6) continue; // שבת

    const yyyy_mm_dd = currentDate.toISOString().split('T')[0];

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

        appointments.push({
          business: businessId,
          customer: null,
          service: 'תספורת גברים',
          date: yyyy_mm_dd,
          time,
          status: 'available'
        });
      }
    }
  }

  try {
    const result = await Appointment.insertMany(appointments);
    console.log(`✅ Seeded ${result.length} appointment slots for business: ${businessId}`);
  } catch (error) {
    console.error("❌ Error inserting appointments:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

const businessIdArg = process.argv[2];
seedAppointments(businessIdArg);
