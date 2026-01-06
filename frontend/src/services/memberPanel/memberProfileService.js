import API from "../../API/Api";

const memberProfileService = {
  getMemberProfile: async () => {
    try {
      const response = await API.get("/member-panel/profile/member/profile");
      return response.data;
    } catch (error) {
      console.error("Service error fetching member profile:", error);
      throw error;
    }
  },

  updateMemberProfile: async (profileData) => {
    try {
      const response = await API.put(
        "/member-panel/profile/member/profile",
        profileData
      );
      return response.data;
    } catch (error) {
      console.error("Service error updating member profile:", error);
      throw error;
    }
  },

  updateMemberPassword: async (passwordData) => {
    try {
      const response = await API.put(
        "/member-panel/profile/member/profile/change-password",
        passwordData
      );
      return response.data;
    } catch (error) {
      console.error("Service error changing password:", error);
      throw error;
    }
  },
};

export default memberProfileService;
