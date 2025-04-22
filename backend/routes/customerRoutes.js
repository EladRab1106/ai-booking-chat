const express = require("express");
const router = express.Router();

const {
  createCustomer,
  getAllCustomers,
  getAllCustomersByBusiness,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

router.get("/", getAllCustomers);
router.post('/', createCustomer);

// שליפת כל הלקוחות של עסק מסוים
router.get('/business/:businessId', getAllCustomersByBusiness);

// שליפת לקוח לפי מזהה
router.get('/:id', getCustomerById);

// עדכון לקוח
router.put('/:id', updateCustomer);

// מחיקת לקוח
router.delete('/:id', deleteCustomer);

module.exports = router;

