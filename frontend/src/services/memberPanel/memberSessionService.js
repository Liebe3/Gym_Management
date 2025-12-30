import API from "../../API/Api";

const memberSessionService = {
  getUpcomingSessions: async (page = 1, limit = 10) => {
    try {
      const response = await API.get(
        `/member-panel/sessions/upcoming-sessions?page=${page}&limit=${limit}`
      );
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error("Error fetching upcoming sessions:", error);
      throw error;
    }
  },

  bookSession: async (sessionData) => {
    try {
      const response = await API.post(
        "/member-panel/sessions/book-session",
        sessionData
      );
      return response.data;
    } catch (error) {
      console.error(
        "Service error booking session:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getAssignedTrainers: async () => {
    try {
      const response = await API.get(
        "/member-panel/sessions/assigned-trainers"
      );
      return response.data.data;
    } catch (error) {
      console.error("Service error fetching assigned trainers:", error);
      throw error;
    }
  },
};

export default memberSessionService;
