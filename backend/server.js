const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require('./db');
const appointmentRoutes = require('./routes/appointmentRoutes');
const businessRoutes = require('./routes/businessRoutes');
const customerRoutes = require('./routes/customerRoutes');


const app = express();
const PORT = process.env.PORT || 5050;

// ✅ CORS נכון ל־localhost:3000 בלבד
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

connectDB();

app.use('/api/appointments', appointmentRoutes);
app.use('/api/businesses', businessRoutes);
app.use("/api/customers",customerRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
