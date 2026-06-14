import api from "./api";

export const getAllProperties = (params) => api.get("/property", { params });
export const getPropertyById = (id) => api.get(`/property/${id}`);
export const getOwnerProperties = () => api.get("/property/owner/my-properties");
export const createProperty = (payload) => api.post("/property", payload);
export const updateProperty = (id, payload) => api.put(`/property/${id}`, payload);
export const deleteProperty = (id) => api.delete(`/property/${id}`);
