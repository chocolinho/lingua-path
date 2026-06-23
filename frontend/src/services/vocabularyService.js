import axiosClient from "../api/axiosClient";

export const getVocabularies = async () => {
    const response = await axiosClient.get("/api/vocabularies");
    return response.data;
};

export const searchVocabularies = async (keyword) => {
    const response = await axiosClient.get("/api/vocabularies/search", {
        params: {
            keyword,
        },
    });

    return response.data;
};

export const createVocabulary = async (vocabulary) => {
    const response = await axiosClient.post("/api/vocabularies", vocabulary);
    return response.data;
};

export const updateVocabulary = async (id, vocabulary) => {
    const response = await axiosClient.put(`/api/vocabularies/${id}`, vocabulary);
    return response.data;
};

export const deleteVocabulary = async (id) => {
    await axiosClient.delete(`/api/vocabularies/${id}`);
};

export const getVocabularyPage = async (page = 0, size = 10) => {
    const response = await axiosClient.get("/api/vocabularies/page", {
        params: {
            page,
            size,
        },
    });

    return response.data;
};