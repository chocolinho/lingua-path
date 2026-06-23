import axiosClient from "../api/axiosClient";

export const getCurrentUser = async () => {
    const response = await axiosClient.get("/api/users/me");
    return response.data;
};