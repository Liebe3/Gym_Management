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

export const getMembers = () => API.get("/members");
export const createMember = (newMember) => API.post("/members", newMember);
export const getMemberById = (id) => API.get(`/members/${id}`);
export const updateMember = (id, updatedMember) =>
  API.put(`/members/${id}`, updatedMember);
export const deleteMember = (id) => API.delete(`/members/${id}`);

//Mebership Plans API
export const getAllPlans = () => API.get("/membership-plans");
export const createPlan = (newPlan) => API.post("/membership-plans", newPlan);
export const updatePlan = (id, updatedPlan) =>
  API.put(`/membership-plans/${id}`, updatedPlan);

export default API;
