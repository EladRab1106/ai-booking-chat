const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  visits: {
    type: Number,
    default: 0,
  },
  lastVisit: {
    type: Date,
  },
  isVIP: {
    type: Boolean,
    default: false,
  },
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Customer', customerSchema);
