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

  getUsersByRole: async (role) => {
    return userService.getAllUser({ role });
  },

  searchUsers: async (searchTerm) => {
    return userService.getAllUser({ search: searchTerm });
  },

  getFilteredUsers: async ({
    role = null,
    search = null,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 100,
  }) => {
    return userService.getAllUser({
      role,
      search,
      sortBy,
      sortOrder,
      page,
      limit,
    });
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
