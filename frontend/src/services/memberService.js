import API from "../API/Api";

const memberService = {
  getAllMember: async () => {
    try {
      const response = await API.get("/member");
      return response.data;
    } catch (error) {
      console.error("Service error", error);
      throw error;
    }
  },
  createMember: async () => {
    try {
      const response = await API.post("/member");
      return response.data;
    } catch (error) {
      console.error("Service error", error);
      throw error;
    }
  },
};

export default memberService;
