import API from "./Api";

//trainer API
export const getAllTrainer = () => API.get("/trainer");
export const createTrainer = (newTrainer) => API.post("/trainer", newTrainer);
