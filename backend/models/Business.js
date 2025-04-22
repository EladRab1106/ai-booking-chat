const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  industry: {
    type: String, // למשל: "מספרה", "קוסמטיקה"
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: String,
  address: String,
  openingHours: {
    type: Map,
    of: String,
  },
  services: [
    {
      name: String,
      price: Number,
      duration: Number // בדקות
    }
  ],
  products: [
    {
      name: String,
      description: String,
      price: Number,
    }
  ]
}, {
  timestamps: true,
});

module.exports = mongoose.model('Business', businessSchema);
