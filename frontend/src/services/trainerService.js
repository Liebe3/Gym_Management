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

      // queryParams.append("all", "true");

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

  getTrainerStats: async (trainerId) => {
    try {
      const response = await API.get(`/trainer/${trainerId}/stats`);
      return response.data;
    } catch (error) {
      console.error("Get trainer stats service error", error);
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

  //Trainer endpoints
  getMyProfile: async () => {
    try {
      const response = await API.get("/trainer-panel/profile");
      return response.data;
    } catch (error) {
      console.error("Get my profile service error", error);
      throw error;
    }
  },

  updateMyProfile: async (updateData) => {
    try {
      const response = await API.put("/trainer-panel/profile", updateData);
      return response.data;
    } catch (error) {
      console.error("Update my profile service error", error);
      throw error;
    }
  },

  // Get trainer's clients with filters
  getMyClients: async (filters = {}) => {
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
      const endpoint = `/trainer-panel/clients${
        queryString ? `?${queryString}` : ""
      }`;
      const response = await API.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Get my clients service error", error);
      throw error;
    }
  },

  // Get single client details
  getClientById: async (memberId) => {
    try {
      const response = await API.get(`/trainer-panel/clients/${memberId}`);
      return response.data;
    } catch (error) {
      console.error("Get client by ID service error", error);
      throw error;
    }
  },
};

export default trainerService;
