const Appointment = require("../models/Appointment");
const Customer = require('../models/Customer');


 const createAppointment = async (req, res) => {
  try {
    const appointmentToCreate = req.body;

    const createdAppointment = await Appointment.create(appointmentToCreate);

    res.status(201).json(createdAppointment);
  } catch (error) {
    console.error("❌ Failed to create appointment:", error.message);
    res
      .status(500)
      .json({ message: "Failed to create appointment", error: error.message });
  }
};

 const getAllAppointments = async (req, res) => {
  try {
    // שלב 1: שלוף את כל התורים מהמסד עם mongoose

    const allAppointments = await Appointment.find({});
    res.status(200).json(allAppointments);

    // שלב 2: החזר אותם בתגובה עם status 200
  } catch (error) {
    console.error("❌ Failed to load appointments:", error.message);
    res
      .status(500)
      .json({ message: "Failed to load appointments", error: error.message });
  }
};

const getAppointmentsByCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const appointments = await Appointment.find({ customer: customerId });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to get appointments", error: error.message });
  }
};

const getAppointmentsByBusiness = async (req, res) => {
  try {
    const businessId = req.params.businessId;
    const appointments = await Appointment.find({ business: businessId });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to get appointments", error: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    await Appointment.findByIdAndDelete(appointmentId);
    res.status(200).json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete", error: error.message });
  }
};

const getAvailableAppointments = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { date, service } = req.query;

    const query = {
      business: businessId,
      status: 'available',
    };

    if (date) {
      query.date = date;
    }

    if (service) {
      query.service = service;
    }

    const appointments = await Appointment.find(query);
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get available appointments",
      error: error.message
    });
  }
};


const bookAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { name, phone, businessId, service } = req.body; // ⬅️ קלט שירות מהבקשה

    // שלב 1: בדוק אם לקוח קיים
    let customer = await Customer.findOne({ phone, business: businessId });

    if (!customer) {
      customer = await Customer.create({ name, phone, business: businessId });
    }

    // שלב 2: עדכן את התור, כולל השירות הנבחר
    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: 'scheduled',
        customer: customer._id,
        service: service || 'לא צויין שירות', // ⬅️ מעדכן את השדה החשוב הזה
      },
      { new: true }
    );

    // שלב 3: שמור את התור בפרופיל הלקוח
    await Customer.findByIdAndUpdate(customer._id, {
      $push: {
        appointments: {
          $each: [updated._id],
          $position: 0,
          $slice: 10
        }
      },
      $inc: { visits: 1 },
      $set: { lastVisit: new Date() }
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({
      message: "Failed to book appointment",
      error: error.message
    });
  }
};

const completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = 'completed';
    appointment.checkInTime = new Date();
    await appointment.save();

    res.status(200).json({ message: "Appointment marked as completed" });
  } catch (err) {
    console.error("Complete appointment error:", err);
    res.status(500).json({ message: "Failed to complete appointment" });
  }
};

// controllers/appointmentController.js
const checkinAppointment = async (req, res) => {
  try {
    const { phone } = req.body;

    const customer = await Customer.findOne({ phone });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const today = new Date().toISOString().split("T")[0];

    const appointments = await Appointment.find({
      business: customer.business,
      customer: customer._id,
      date: today,
      status: 'scheduled'
    });

    const now = new Date();
    const appointment = appointments.find(appt => {
      const [hours, minutes] = appt.time.split(":").map(Number);
      const appointmentTime = new Date(now);
      appointmentTime.setHours(hours, minutes, 0, 0);

      const diffMinutes = Math.abs((appointmentTime - now) / (1000 * 60));
      return diffMinutes <= 120; // טווח של שעתיים
    });

    if (!appointment) {
      return res.status(404).json({ message: "No matching appointment found" });
    }

    appointment.status = 'completed';
    appointment.checkInTime = new Date();
    await appointment.save();

    res.status(200).json({ message: "Check-in successful" });
  } catch (err) {
    console.error("Check-in error:", err);
    res.status(500).json({ message: "Failed to check in" });
  }
};

// controllers/appointmentController.js
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reopen } = req.body; // אופציונלי

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = 'canceled';
    await appointment.save();

    if (reopen) {
      await Appointment.create({
        business: appointment.business,
        date: appointment.date,
        time: appointment.time,
        service: appointment.service,
        servicePrice: appointment.servicePrice,
        serviceDuration: appointment.serviceDuration,
        status: 'available',
      });
    }

    res.status(200).json({ message: "Appointment canceled successfully" });
  } catch (err) {
    console.error("Cancel appointment error:", err);
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
};






module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentsByCustomer,
  getAppointmentsByBusiness,
  updateAppointmentStatus,
  deleteAppointment,
  getAvailableAppointments,
  bookAppointment,
  completeAppointment,
  checkinAppointment,
  cancelAppointment
};
