const Business = require('../models/business')
const Appointment = require("../models/Appointment");


const createBusiness = async (req, res) => {
    try {
      const newBusiness = await Business.create(req.body);
      res.status(201).json(newBusiness);
    } catch (error) {
      console.error("❌ Failed to create business:", error.message);
      res.status(500).json({ message: "Failed to create business", error: error.message });
    }
  };

  const getAllBusinesses = async (req, res) => {
    try {
      const businesses = await Business.find();
      res.status(200).json(businesses);
    } catch (error) {
      console.error("❌ Failed to fetch businesses:", error.message);
      res.status(500).json({ message: "Failed to fetch businesses", error: error.message });
    }
  }


  const getBusinessById = async (req, res) => {
    const { id } = req.params;
    try {
      const business = await Business.findById(id);
      if (!business) return res.status(404).json({ message: "Business not found" });
  
      res.status(200).json(business);
    } catch (error) {
      console.error("❌ Failed to fetch business by ID:", error.message);
      res.status(500).json({ message: "Failed to fetch business", error: error.message });
    }
  };


  const updateBusiness = async (req, res) => {
    const { id } = req.params;
    try {
      const updated = await Business.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: "Business not found" });
  
      res.status(200).json(updated);
    } catch (error) {
      console.error("❌ Failed to update business:", error.message);
      res.status(500).json({ message: "Failed to update business", error: error.message });
    }
  };


  const deleteBusiness = async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await Business.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: "Business not found" });
  
      res.status(200).json({ message: "Business deleted successfully" });
    } catch (error) {
      console.error("❌ Failed to delete business:", error.message);
      res.status(500).json({ message: "Failed to delete business", error: error.message });
    }
  };

  const getBusinessStats = async (req, res) => {
    try {
      const businessId = req.params.id;
  
      // 1. נביא את העסק (כדי לקבל את רשימת השירותים והמחירים)
      const business = await Business.findById(businessId);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
  
      // 2. נביא את כל התורים שהושלמו
      const completedAppointments = await Appointment.find({
        business: businessId,
        status: "scheduled",
      });
  
      const totalAppointments = completedAppointments.length;
  
      // 3. חישוב הכנסות לפי התאמת שם שירות למחיר
      const totalRevenue = completedAppointments.reduce((sum, appt) => {
        const serviceDetails = business.services.find(s => s.name === appt.service);
        return sum + (serviceDetails?.price || 0);
      }, 0);
  
      res.status(200).json({
        totalAppointments,
        totalRevenue,
        avgCustomerValue: totalAppointments
          ? (totalRevenue / totalAppointments).toFixed(2)
          : 0,
      });
    } catch (err) {
      console.error("Get business stats error:", err);
      res.status(500).json({ message: "Failed to get business stats" });
    }
  };
  
  
  

  const getBusinessRecommendations = async (req, res) => {
    try {
      const businessId = req.params.id;
  
      const appointments = await Appointment.find({ business: businessId });
  
      let recommendations = [];
  
      if (appointments.length < 20) {
        recommendations.push("נסה להגדיל חשיפה – צור מבצע ללקוחות חדשים");
      }
  
      if (appointments.length > 50) {
        recommendations.push("הלקוחות אוהבים אותך! שקול להרחיב את היצע השירותים");
      }
  
      recommendations.push("עקוב אחרי הלקוחות שלא חזרו מעל 60 יום והצע להם קופון");
  
      res.status(200).json(recommendations);
    } catch (err) {
      console.error("Get business recommendations error:", err);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  };
  
  
  


  module.exports = {
    createBusiness,
    getAllBusinesses,
    getBusinessById,
    updateBusiness,
    deleteBusiness,
    getBusinessStats,
    getBusinessRecommendations
  };