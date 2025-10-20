import API from "../API/Api";

const sessionService = {
  // Get all sessions with filters
  getAllSessions: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "all"
        ) {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const endpoint = `/session${queryString ? `?${queryString}` : ""}`;

      const response = await API.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  },

  // Get session by ID
  getSessionById: async (sessionId) => {
    try {
      const response = await API.get(`/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error("Get session by ID service error:", error);
      throw error;
    }
  },

  // Get sessions for a specific trainer
  getTrainerSessions: async (trainerId, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const endpoint = `/session/trainer/${trainerId}${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await API.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Get trainer sessions service error:", error);
      throw error;
    }
  },

  // Get sessions for a specific member
  getMemberSessions: async (memberId, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const endpoint = `/session/member/${memberId}${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await API.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Get member sessions service error:", error);
      throw error;
    }
  },

  // Create a new session
  createSession: async (sessionData) => {
    try {
      const response = await API.post("/session", sessionData);
      return response.data;
    } catch (error) {
      console.error(
        "Create session service error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Update a session
  updateSession: async (sessionId, updateData) => {
    try {
      const response = await API.put(`/session/${sessionId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(
        "Update session service error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Delete a session
  deleteSession: async (sessionId) => {
    try {
      const response = await API.delete(`/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error("Delete session service error:", error);
      throw error;
    }
  },
};

export default sessionService;
