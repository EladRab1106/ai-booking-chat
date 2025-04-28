const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Business = require("../models/business");

const registerUser = async (req, res) => {
  try {
    const { businessName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newBusiness = await Business.create({
      name: businessName,
      email: email
    });

    const newUser = await User.create({
      businessName,
      email,
      password: hashedPassword,
      businessId: newBusiness._id,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message || "Server error during registration" });
  }
};

const registerToExistingBusiness = async (req, res) => {
    try {
      const { businessId, businessName, email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email already registered" });
  
      const existingBusiness = await Business.findById(businessId);
      if (!existingBusiness) return res.status(404).json({ message: "Business not found" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await User.create({
        businessName,
        email,
        password: hashedPassword,
        businessId: businessId,
      });
  
      res.status(201).json({ message: "User registered successfully to existing business" });
    } catch (err) {
      console.error("Register to existing business error:", err);
      res.status(500).json({ message: err.message || "Server error during registration" });
    }
  };
  

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { userId: user._id, businessId: user.businessId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken.push(refreshToken);
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // production = true
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "Missing refresh token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.refreshToken.includes(token)) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id, businessId: user.businessId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh token error:", err.message);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};
const logoutUser = async (req, res) => {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken; // ⬅️ לוקח מהקוקי או מהבקשה
  
      if (!token) return res.sendStatus(204); // אין טוקן? צא בשקט
  
      const user = await User.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = user.refreshToken.filter(t => t !== token);
        await user.save();
      }
  
      res.clearCookie("refreshToken", { httpOnly: true, sameSite: "Lax", secure: false });
      res.sendStatus(204);
    } catch (err) {
      console.error("Logout error:", err.message);
      res.status(500).json({ message: "Logout failed" });
    }
  };
  

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("businessId");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Get profile error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getMyProfile,
  registerToExistingBusiness
};
