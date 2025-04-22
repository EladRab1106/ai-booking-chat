const express = require("express");
const router = express.Router();

const {
  createCustomer,
  getAllCustomers,
  getAllCustomersByBusiness,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getMostCommonService
} = require("../controllers/customerController");

router.get("/", getAllCustomers);
router.post('/', createCustomer);

// שליפת כל הלקוחות של עסק מסוים
router.get('/business/:businessId', getAllCustomersByBusiness);

router.get("/common-service", getMostCommonService);


// שליפת לקוח לפי מזהה
router.get('/:id', getCustomerById);

// עדכון לקוח
router.put('/:id', updateCustomer);

// מחיקת לקוח
router.delete('/:id', deleteCustomer);



module.exports = router;

