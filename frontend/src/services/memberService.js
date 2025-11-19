import API from "../API/Api";

const memberService = {
  getAllMember: async (filters = {}) => {
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
      const endpoint = `/member${queryString ? `?${queryString}` : ""}`;

      const response = await API.get(endpoint);
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

  updateMember: async (memberId, updateData) => {
    try {
      const response = await API.put(`/member/${memberId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(
        "Service error updating member:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deleteMember: async (memberId) => {
    try {
      const response = await API.delete(`/member/${memberId}`);
      return response.data;
    } catch (error) {
      console.error("Service error", error);
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

  /*
      Manual trigger to check for expired memberships (useful for testing)
 */
  // checkExpiredMemberships: async () => {
  //   try {
  //     const response = await API.post("/member/check-expirations");
  //     return response.data;
  //   } catch (error) {
  //     console.error("Service error checking expired memberships:", error);
  //     throw error;
  //   }
  // },
};

export default memberService;
