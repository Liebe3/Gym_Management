import API from "../../API/Api";

// Get all membership plans and member's current plan
export const getMembershipPlans = async () => {
  try {
    const response = await API.get("/member-panel/membership/membership-plans");
    return response.data;
  } catch (error) {
    console.error("Error fetching membership plans:", error);
    throw error;
  }
};
