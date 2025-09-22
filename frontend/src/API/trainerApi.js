import API from "./Api";

//trainer API
export const getAllTrainer = () => API.get("/trainer");
export const getTrainerId = (id) => API.get(`/trainer/${id}`);
export const createTrainer = (newTrainer) => API.post("/trainer", newTrainer);
export const updateTrainer = (id, updateTrainer) =>
  API.put(`/trainer${id}`, updateTrainer);
export const deleteTrainer = (id) => API.delete(`/trainer/${id}`);
