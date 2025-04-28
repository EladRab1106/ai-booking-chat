export const getBusinessIdFromToken = () => {
    const token = localStorage.getItem("accessToken");
    
    if (!token) return null;
  
    const payload = JSON.parse(atob(token.split(".")[1])); // מפענח את חלק המידע בטוקן
    return payload.businessId;
  };
  