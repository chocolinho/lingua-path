import axiosClient from "../api/axiosClient";

export const getTopics = async () => {
    const response = await axiosClient.get("/api/topics");
    return response.data;
};

export const getVocabularies = async () => {
    const response = await axiosClient.get("/api/vocabularies");
    return response.data;
};

export const getQuizResults = async () => {
    const response = await axiosClient.get("/api/quizzes/results");
    return response.data;
};