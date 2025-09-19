import API from "../API/Api";

const membershipPlanService = {
  getAllPlans: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "all"
        )
          queryParams.append(key, value);
      });

      const queryString = queryParams.toString();
      const endpoint = `/membership-plans${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await API.get(endpoint);
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

  deletePlan: async (planId) => {
    try {
      const response = await API.delete(`/membership-plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  },
};

export default membershipPlanService;
