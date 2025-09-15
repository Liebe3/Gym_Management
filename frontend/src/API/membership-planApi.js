import API from "./Api";

//Mebership Plans API
export const getAllPlans = () => API.get("/membership-plans");
export const createPlan = (newPlan) => API.post("/membership-plans", newPlan);
export const updatePlan = (id, updatedPlan) =>
  API.put(`/membership-plans/${id}`, updatedPlan);
export const deletePlan = (id) => API.delete(`/membership-plans/${id}`);
