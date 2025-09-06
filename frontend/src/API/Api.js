import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api" //backend
      : "https://JPGym_management.com/api",
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

//Mebership Plans API
export const getAllPlans = () => API.get("/membership-plans");
export const createPlan = (newPlan) => API.post("/membership-plans", newPlan);
export const updatePlan = (id, updatedPlan) =>
  API.put(`/membership-plans/${id}`, updatedPlan);
export const deletePlan = (id) => API.delete(`/membership-plans/${id}`);

//user API
export const getAllUser = () => API.get("/user");
export const createUser = (newUser) => API.post("/user", newUser)

//member API
export const getAllMember = () => API.get("/member");
export const createMember = (newMember) => API.post("/member", newMember);
export const updateMember = (id, updateMember) =>
  API.put(`/member/${id}`, updateMember); // Add this
export const checkUserActiveMemberShip = (userId) =>
  API.get(`/member/check-active/${userId}`);
export const deletedMember = (id) => API.delete(`/member/${id}`);

export default API;
