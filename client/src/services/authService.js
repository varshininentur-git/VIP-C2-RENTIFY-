import api from "./api";

export const loginUser = (credentials) => api.post("/user/login", credentials);
export const registerUser = (userData) => api.post("/user/signup", userData);
