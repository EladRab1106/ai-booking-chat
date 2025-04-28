// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: false,
  },
  service: {
    type: String,
    required: true,
  },
  servicePrice: {
    type: Number,
  },
  serviceDuration: {
    type: Number,
  },
  date: {
    type: String, // yyyy-mm-dd
    required: true,
  },
  time: {
    type: String, // hh:mm
    required: true,
  },
  status: {
    type: String,
    enum: ['available','scheduled', 'completed', 'canceled'],
    default: 'scheduled',
  },
  checkInTime: {
    type: Date,
  },
  notes: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Appointment', appointmentSchema);
