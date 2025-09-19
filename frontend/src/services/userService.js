import API from "../API/Api";

const userService = {
  getAllUser: async (filters = {}) => {
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
      const endpoint = `/user${queryString ? `?${queryString}` : ""}`;

      const response = await API.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Service error", error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await API.post("/user", userData);
      return response.data;
    } catch (error) {
      console.error("Service error", error);
      throw error;
    }
  },

  updateUser: async (userId, updateData) => {
    try {
      const response = await API.put(`/user/${userId}`, updateData);
      return response.data;
    } catch (error) {
      console.error("Service error", error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const reponse = await API.delete(`/user/${userId}`);
      return reponse.data;
    } catch (error) {
      console.error("Service error", error);
      throw error;
    }
  },
};

export default userService;
