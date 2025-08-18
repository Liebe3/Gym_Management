import API from "../API/Api";

const membershipPlanService = {
  getAllPlans: async () => {
    try {
      const response = await API.get("/membership-plans");
      return response.data;
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  },

  createPlan: async (planData) => {
    try {
      const response = await API.post("/membership-plans", planData);
      return response.data;
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  },

  updatePlan: async (planId, newPlan) => {
    try {
      const response = await API.put(`/membership-plans/${planId}`, newPlan);
      return response.data;
    } catch (error) {
      console.error("Service error", error);
      throw error;
    }
  },
};

export default membershipPlanService;
