import axiosClient from "../api/axiosClient";

export const login = async (email, password) => {
    const response = await axiosClient.post("/api/auth/login", {
        email,
        password,
    });

    return response.data;
};

export const register = async (userData) => {
    const response = await axiosClient.post("/api/auth/register", userData);

    return response.data;
};