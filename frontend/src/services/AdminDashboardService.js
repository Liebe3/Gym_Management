
import API from "../API/Api";

const adminDashboardService = {
  getAdminDashboard: async () => {
    try {
      const response = await API.get("/dashboard/admin");
      return response.data;
    } catch (error) {
      console.error("Error fetching admin dashboard:", error);
      throw error;
    }
  },
};

export default adminDashboardService;