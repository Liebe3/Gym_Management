import API from "../API/Api";

const trainerService = {
  getAllTrainer: async (filters = {}) => {
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
      const endpoint = `/trainer${queryString ? `?${queryString}` : ""}`;
      const response = await API.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Service error", error);
      throw error;
    }
  },

  createTrainer: async (trainerData) => {
    try {
      const response = await API.post("/trainer", trainerData);
      return response.data;
    } catch (error) {
      console.error("Service Error", error);
      throw error;
    }
  },

  // Get trainer by ID
  getTrainerById: async (trainerId) => {
    try {
      const response = await API.get(`/trainer/${trainerId}`);
      return response.data;
    } catch (error) {
      console.error("Get trainer by ID service error", error);
      throw error;
    }
  },

  updateTrainer: async (trainerId, updateData) => {
    try {
      const response = await API.put(`/trainer/${trainerId}`, updateData);
      return response.data;
    } catch (error) {
      console.error("Server error updating member");
      throw error;
    }
  },

  deleteTrainer: async (trainerId) => {
    try {
      const response = await API.delete(`/trainer/${trainerId}`);
      return response.data;
    } catch (error) {
      console.error("Service error", error);
      throw error;
    }
  },
};

export default trainerService;
