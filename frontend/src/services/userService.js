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

      console.log("Fetching user with URL: ", endpoint);
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
};

export default userService;
