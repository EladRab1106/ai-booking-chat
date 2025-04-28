const express = require("express");
const router = express.Router();

const {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  getBusinessStats,
  getBusinessRecommendations
} = require("../controllers/businessController");

router.post("/", createBusiness);
router.get("/", getAllBusinesses);
router.get("/:id", getBusinessById);
router.put("/:id", updateBusiness);
router.delete("/:id", deleteBusiness);
router.get("/:id/stats", getBusinessStats);
router.get("/:id/recommendations", getBusinessRecommendations);



module.exports = router;
