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
  createMember: async (memberData) => {
    try {
      const response = await API.post("/member", memberData);
      return response.data;
    } catch (error) {
      console.error("Service error", error.response?.data || error.message);
      throw error;
    }
  },

  checkUserActiveMembership: async (userId) => {
    try {
      const response = await API.get(`/member/check-active/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Service error checking active membership:", error);
      throw error;
    }
  },
};

export default memberService;
