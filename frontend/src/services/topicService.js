import axiosClient from "../api/axiosClient";

export const getTopics = async () => {
    const response = await axiosClient.get("/api/topics");
    return response.data;
};

export const createTopic = async (topic) => {
    const response = await axiosClient.post("/api/topics", topic);
    return response.data;
};

export const updateTopic = async (id, topic) => {
    const response = await axiosClient.put(`/api/topics/${id}`, topic);
    return response.data;
};

export const deleteTopic = async (id) => {
    await axiosClient.delete(`/api/topics/${id}`);
};