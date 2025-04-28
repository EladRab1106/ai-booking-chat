const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointmentsByBusiness,
  getAppointmentsByCustomer,
  deleteAppointment,
  updateAppointmentStatus,
  getAllAppointments,
  getAvailableAppointments,
  bookAppointment,
  completeAppointment,
  checkinAppointment,
  cancelAppointment
} = require('../controllers/appointmentController');

// יצירת תור חדש
router.post('/', createAppointment);

router.get('/appointments',getAllAppointments);

// שליפת כל התורים של עסק מסוים
router.get('/business/:businessId', getAppointmentsByBusiness);

// שליפת כל התורים של לקוח מסוים
router.get('/customer/:customerId', getAppointmentsByCustomer);

// עדכון סטטוס של תור
router.patch('/:appointmentId/status', updateAppointmentStatus);

router.patch('/:id/cancel', cancelAppointment);

// מחיקת תור
router.delete('/:appointmentId', deleteAppointment);

router.get('/business/:businessId/available', getAvailableAppointments);

router.patch('/:appointmentId/book', bookAppointment);

router.post('/checkin', checkinAppointment);

router.patch('/:id/complete', completeAppointment);


module.exports = router;
