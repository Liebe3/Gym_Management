import API from "../API/Api";

const membershipPlanService = {
  createPlan: async (planData) => {
    try {
      const response = await API.post("/plans", planData); 
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message; 
    }
  },
};

export default membershipPlanService; 