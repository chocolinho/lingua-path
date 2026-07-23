import axiosClient from "../api/axiosClient";

export const askAiTutor = async ({ message, level = "A1", topic }) => {
    const response = await axiosClient.post("/api/ai/tutor", {
        message,
        level,
        topic: topic || undefined,
    });

    return response.data;
};
