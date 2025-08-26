import API from "../API/Api";

const userService = {
  getAllUser: async () => {
    try {
      const response = await API.get("/user");
      return response.data;
    } catch (error) {
      console.error("Service error", error);
      throw error;
    }
  },
};

export default userService;
