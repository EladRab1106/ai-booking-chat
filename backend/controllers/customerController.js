const Customer = require('../models/Customer');
const Appointment = require("../models/Appointment");


// יצירת לקוח חדש
const createCustomer = async (req, res) => {
  try {
    const customerToCreate = req.body;
    const createdCustomer = await Customer.create(customerToCreate);
    res.status(201).json(createdCustomer);
  } catch (error) {
    console.error("❌ Failed to create customer:", error.message);
    res.status(500).json({ message: "Failed to create customer", error: error.message });
  }
};

// שליפת כל הלקוחות
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.status(200).json(customers);
  } catch (error) {
    console.error("❌ Failed to get customers:", error.message);
    res.status(500).json({ message: "Failed to get customers", error: error.message });
  }
};

// שליפת כל הלקוחות של עסק מסוים
const getAllCustomersByBusiness = async (req, res) => {
  try {
    const businessId = req.params.businessId;
    const customers = await Customer.find({ business: businessId });
    res.status(200).json(customers);
  } catch (error) {
    console.error("❌ Failed to get customers by business:", error.message);
    res.status(500).json({ message: "Failed to get customers", error: error.message });
  }
};

// שליפת לקוח לפי מזהה
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    res.status(200).json(customer);
  } catch (error) {
    console.error("❌ Failed to get customer:", error.message);
    res.status(500).json({ message: "Failed to get customer", error: error.message });
  }
};

// עדכון לקוח
const updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCustomer) return res.status(404).json({ message: "Customer not found" });

    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("❌ Failed to update customer:", error.message);
    res.status(500).json({ message: "Failed to update customer", error: error.message });
  }
};

// מחיקת לקוח
const deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Customer not found" });

    res.status(200).json({ message: "Customer deleted" });
  } catch (error) {
    console.error("❌ Failed to delete customer:", error.message);
    res.status(500).json({ message: "Failed to delete customer", error: error.message });
  }
};




const getMostCommonService = async (req, res) => {
  try {
    const { phone, businessId } = req.query;

    const customer = await Customer.findOne({ phone, business: businessId });

    if (!customer) {
      return res.status(200).json({ message: "לקוח לא נמצא", mostCommonService: null });
    }

    const appointments = await Appointment.find({
      customer: customer._id,
      business: businessId,
      status: "scheduled",
    });

    if (!appointments.length) {
      return res.status(200).json({ message: "אין תורים קודמים", mostCommonService: null });
    }

    const serviceCount = {};
    for (const appt of appointments) {
      serviceCount[appt.service] = (serviceCount[appt.service] || 0) + 1;
    }

    const mostCommonService = Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0][0];

    res.status(200).json({
      customerName: customer.name,
      mostCommonService,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get customer", error: err.message });
  }
};


module.exports = {
  createCustomer,
  getAllCustomers,
  getAllCustomersByBusiness,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getMostCommonService
};
