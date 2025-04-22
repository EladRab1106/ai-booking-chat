const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });
const Business = require('../models/business'); // ודא שהנתיב למודל נכון

const MONGO_URI = process.env.MONGO_URI;

async function updateBusinessToHebrew() {
  await mongoose.connect(MONGO_URI);
  console.log("🔌 Connected to MongoDB");

  const businessName = "Liat Salon";

  const hebrewServices = [
    { name: "תספורת נשים", price: 120, duration: 45 },
    { name: "תספורת גברים", price: 80, duration: 30 },
    { name: "תספורת ילדים", price: 80, duration: 30 },
    { name: "תספורת + זקן", price: 90, duration: 40 },
    { name: "החלקה יפנית", price: 400, duration: 90 }
  ];

  const hebrewProducts = [
    {
      name: "קליי לשיער",
      price: 60,
      description: "אחיזה טבעית במראה מאט לגברים. נעים על השיער."
    },
    {
      name: "ג'ל חזק",
      price: 45,
      description: "אחיזה ליום שלם, מבריק קלות. מושלם לעיצוב חד."
    },
    {
      name: "סרום לקצוות מפוצלים",
      price: 70,
      description: "לשיער יבש או צבוע. מרכך ומחליק את השיער."
    },
    {
      name: "ספריי לעיצוב קל",
      price: 50,
      description: "מקבע בלי כובד. מתאים לכל סוגי השיער."
    }
  ];

  const hebrewPolicy = {
    booking: "קבלת לקוחות בתיאום מראש בלבד.",
    cancellation: "ניתן לבטל עד 3 שעות לפני.",
    lateArrival: "איחור של יותר מ-10 דקות = ביטול אוטומטי."
  };

  const updated = await Business.findOneAndUpdate(
    { name: businessName },
    {
      $set: {
        services: hebrewServices,
        products: hebrewProducts,
        policy: hebrewPolicy,
      },
    },
    { new: true }
  );

  if (updated) {
    console.log("✅ Business updated successfully:", updated.name);
  } else {
    console.log("❌ Business not found.");
  }

  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB");
}

updateBusinessToHebrew();
