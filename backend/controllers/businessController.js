const Business = require('../models/business')

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


  module.exports = {
    createBusiness,
    getAllBusinesses,
    getBusinessById,
    updateBusiness,
    deleteBusiness
  };