import API from "../API/Api";

const dashboardService = {
  getTrainerDashboard: async () => {
    try {
      const response = await API.get("/trainer-panel/dashboard");
      return response.data;
    } catch (error) {
      console.error("Get trainer dashboard service error:", error);
      throw error;
    }
  },
};

export default dashboardService;
