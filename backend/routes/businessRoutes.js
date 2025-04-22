const express = require("express");
const router = express.Router();

const {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
} = require("../controllers/businessController");

router.post("/", createBusiness);
router.get("/", getAllBusinesses);
router.get("/:id", getBusinessById);
router.put("/:id", updateBusiness);
router.delete("/:id", deleteBusiness);

module.exports = router;
