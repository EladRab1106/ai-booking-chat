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
;




module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentsByCustomer,
  getAppointmentsByBusiness,
  updateAppointmentStatus,
  deleteAppointment,
  getAvailableAppointments,
  bookAppointment
};
