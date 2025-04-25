const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const connectDB = require('./db');
const cookieParser = require("cookie-parser");


// טוען את משתני הסביבה
dotenv.config();

// מביא את כל הראוטים
const appointmentRoutes = require('./routes/appointmentRoutes');
const businessRoutes = require('./routes/businessRoutes');
const customerRoutes = require('./routes/customerRoutes');
const userRoutes = require('./routes/userRoutes'); 

const app = express();
const PORT = process.env.PORT || 5050;

// ✅ CORS – מתיר גישה מה-Frontend שלך
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(cookieParser());


// ✅ מאפשר JSON בבקשות
app.use(express.json());

// ✅ חיבור למסד הנתונים
connectDB();

// ✅ ראוטים
app.use('/api/appointments', appointmentRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/users', userRoutes); // ✅ חדש

// ✅ בדיקה שהשרת רץ
app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

// ✅ הפעלת השרת
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
