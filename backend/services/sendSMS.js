const twilio = require('twilio');

const client = new twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (toPhone, message) => {
    if (process.env.SEND_MESSAGES === "false") {
      console.log(`(Simulation) Would send SMS to ${toPhone}: ${message}`);
      return;
    }
  
    // ✨ תיקון מספר טלפון
    if (toPhone.startsWith('0')) {
      toPhone = '+972' + toPhone.substring(1);
    }
  
    try {
      const res = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: toPhone,
      });
      console.log('✅ SMS sent:', res.sid);
    } catch (err) {
      console.error('❌ Failed to send SMS:', err.message);
    }
  };
  

module.exports = { sendSMS };
