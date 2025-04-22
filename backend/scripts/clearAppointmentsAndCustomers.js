// backend/scripts/clearAppointmentsAndCustomers.js
const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });
const Appointment = require('../models/Appointment');
const Customer = require('../models/Customer');

const MONGO_URI = process.env.MONGO_URI;

async function clearData() {
  await mongoose.connect(MONGO_URI);
  console.log('🔌 Connected to MongoDB');

  await Appointment.deleteMany({});
  await Customer.deleteMany({});
  console.log('🧹 Appointments and Customers deleted');

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
}

clearData();
