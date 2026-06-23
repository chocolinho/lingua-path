import axiosClient from "../api/axiosClient";

export const getQuizResults = async () => {
    const response = await axiosClient.get("/api/quizzes/results");
    return response.data;
};