const businesses = {
    hair_salon_001: {
      id: "hair_salon_001",
      name: "Liat Salon",
      location: "Rishon LeZion",
      email: "liat@salon.com",
      hours: {
        sundayToThursday: "09:00–19:00",
        friday: "09:00–13:00",
        saturday: "Closed"
      },
      services: [
        { name: "Women's Haircut", price: 120, duration: 45 },
        { name: "Men's Haircut", price: 80, duration: 30 },
        { name: "Child's Haircut", price: 80, duration: 30 },
        { name: "Haircut + Beard", price: 90, duration: 40 },
        { name: "Chen Style Haircut", price: 150, duration: 60 },
        { name: "Japanese Straightening", price: 400, duration: 90 }
      ],
      products: [
        {
          name: "Hair Clay",
          price: 60,
          description: "Natural matte hold for men. Light on hair, gentle hold."
        },
        {
          name: "Strong Gel",
          price: 45,
          description: "All-day hold, slight shine. Great for sharp styles."
        },
        {
          name: "Split-End Serum",
          price: 70,
          description: "For dry or colored hair. Softens and smooths hair."
        },
        {
          name: "Light Styling Spray",
          price: 50,
          description: "Sets hair without heaviness. Fits all hair types."
        }
      ],
      policy: {
        booking: "Appointments by scheduling only.",
        cancellation: "Cancel up to 3 hours in advance.",
        lateArrival: "Late over 10 min = auto cancellation."
      },
      chatInstructions: {
        tone: "Friendly and clear",
        handleAppointments: true,
        handleProducts: true
      }
    }
  };
  
  export default businesses;
  