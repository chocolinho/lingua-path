import axiosClient from "../api/axiosClient";

export const login = async (email, password) => {
    const response = await axiosClient.post("/api/auth/login", {
        email: email.trim(),
        password,
    });

    return response.data;
};

export const register = async (userData) => {
    const response = await axiosClient.post("/api/auth/register", {
        username: (userData.username || userData.name).trim(),
        email: userData.email.trim(),
        password: userData.password,
    });

    return response.data;
};
