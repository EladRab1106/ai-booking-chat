import { createBusiness } from "../api/business";
import businesses from "../config/businesses";

export const devCreateBusiness = async () => {
  try {
    const business = businesses.hair_salon_001;

    const {
      id, // נזרק – מזהה פנימי מקומי
      ...businessData
    } = business;

    const newBusiness = await createBusiness(businessData);

    console.log("✅ עסק נוצר בהצלחה עם ID:", newBusiness._id);

    return newBusiness._id; // נשתמש בזה ל-seed
  } catch (err) {
    console.error("❌ שגיאה ביצירת העסק:", err.message);
  }
};
