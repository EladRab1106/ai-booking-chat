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
  date: {
    type: String, // בפורמט yyyy-mm-dd
    required: true,
  },
  time: {
    type: String, // בפורמט hh:mm
    required: true,
  },
  status: {
    type: String,
    enum: ['available','scheduled', 'completed', 'canceled'],
    default: 'scheduled',
  },
  notes: {
    type: String,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Appointment', appointmentSchema);
