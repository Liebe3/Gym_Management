import API from "./Api";
//user API
export const getAllUser = () => API.get("/user");
export const createUser = (newUser) => API.post("/user", newUser);
export const updateUser = (id, updatedUser) =>
  API.put(`/user/${id}`, updatedUser);
export const deleteUser = (id) => API.delete(`/user/${id}`);
