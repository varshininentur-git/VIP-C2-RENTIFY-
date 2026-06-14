import api from "./api";

export const getFavorites = () => api.get("/favorite");
export const getBookings = () => api.get("/booking");
export const getOwnerInquiries = () => api.get("/owner/inquiries");
export const updateInquiryStatus = (id, status) => api.patch(`/owner/inquiries/${id}/status`, { status });
