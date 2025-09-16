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

  getTrainerbyStatus: async (status) => {
    return trainerService.getAllTrainer({ status });
  },

  searchTrainer: async (searchTerm) => {
    return trainerService.getAllTrainer({ search: searchTerm });
  },

  getFilteredTrainers: async ({
    status = null,
    search = null,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 100,
  }) => {
    return trainerService.getAllTrainer({
      status,
      search,
      sortBy,
      sortOrder,
      page,
      limit,
    });
  },
};

export default trainerService;
