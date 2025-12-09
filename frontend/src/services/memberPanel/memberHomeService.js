import API from "../../API/Api";

const memberHomeService = {
  // Applied DRY
  getMemberHomeData: async () => {
    try {
      const response = await API.get("/member-panel/member/home-data");
      return response.data.data;
    } catch (error) {
      console.error(
        "Service error fetching member home data:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getRecentSessions: async () => {
    try {
      const data = await memberHomeService.getMemberHomeData();
      return data?.sessions?.recent || [];
    } catch (error) {
      console.error(
        "Service error fetching recent sessions:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getUpcomingSessions: async () => {
    try {
      const data = await memberHomeService.getMemberHomeData();
      return data?.sessions?.upcoming || [];
    } catch (error) {
      console.error(
        "Service error fetching upcoming sessions:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getMembershipStatus: async () => {
    try {
      const data = await memberHomeService.getMemberHomeData();
      return data?.membershipStatus || {};
    } catch (error) {
      console.error(
        "Service error fetching membership status:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getMemberStats: async () => {
    try {
      const data = await memberHomeService.getMemberHomeData();
      return data?.stats || {};
    } catch (error) {
      console.error(
        "Service error fetching member stats:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // getMemberProfile: async () => {
  //   try {
  //     const data = await memberHomeService.getMemberHomeData();
  //     return data?.data?.member || {};
  //   } catch (error) {
  //     console.error(
  //       "Service error fetching member profile:",
  //       error.response?.data || error.message
  //     );
  //     throw error;
  //   }
  // },

  getTopTrainers: async () => {
    try {
      const data = await memberHomeService.getMemberHomeData();
      return data?.topTrainers || [];
    } catch (error) {
      console.error(
        "Service error fetching top trainers:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getAssignedTrainers: async () => {
    try {
      const response = await API.get("/member-panel/assigned-trainers");
      return response.data.data;
    } catch (error) {
      console.error("Service error fetching assigned trainers:", error);
      throw error;
    }
  },
};

export default memberHomeService;
