const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });
const Appointment = require('../models/Appointment');

const MONGO_URI = process.env.MONGO_URI;

const serviceNameMap = {
  'תספורת לגברים': 'תספורת גברים',
  'תספורת לנשים': 'תספורת נשים',
  'יישור יפני': 'החלקה יפנית',
  'Japanese straightening': 'החלקה יפנית',
  'תספורת+זקן': 'תספורת עם זקן',
  'תספורת לילדים':'תספורת ילדים'
};

async function fixServices() {
  await mongoose.connect(MONGO_URI);
  console.log('🔌 Connected to MongoDB');

  let totalFixed = 0;

  for (const [wrong, correct] of Object.entries(serviceNameMap)) {
    const result = await Appointment.updateMany(
      { service: wrong },
      { $set: { service: correct } }
    );
    console.log(`🛠️ Updated ${result.modifiedCount} appointments: '${wrong}' → '${correct}'`);
    totalFixed += result.modifiedCount;
  }

  await mongoose.disconnect();
  console.log(`✅ Finished. Total fixed: ${totalFixed}`);
}

fixServices();
