import API from "./Api"

//member API
export const getAllMember = () => API.get("/member");
export const createMember = (newMember) => API.post("/member", newMember);
export const updateMember = (id, updateMember) =>
  API.put(`/member/${id}`, updateMember); // Add this
export const checkUserActiveMemberShip = (userId) =>
  API.get(`/member/check-active/${userId}`);
export const deletedMember = (id) => API.delete(`/member/${id}`);
