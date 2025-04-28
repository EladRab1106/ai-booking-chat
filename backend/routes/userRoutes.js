const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth");

// רישום משתמש חדש
router.post("/register", userController.registerUser);

router.post("/register-to-existing-business", userController.registerToExistingBusiness);


// התחברות – מחזיר access + refresh token
router.post("/login", userController.loginUser);

// רענון access token בעזרת refresh token (נשלח מה-cookie)
router.get("/refresh", userController.refreshToken);

// התנתקות – מוחק את הריפרש טוקן
router.post("/logout", userController.logoutUser);

// שליפת פרופיל – רק למשתמש מחובר
router.get("/me", verifyToken, userController.getMyProfile);

module.exports = router;
