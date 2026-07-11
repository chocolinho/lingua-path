import axiosClient from "../api/axiosClient";

export const getAdminStats = async () => {
    const response = await axiosClient.get("/api/admin/stats");
    return response.data;
};

export const getAdminTopics = async () => {
    const response = await axiosClient.get("/api/admin/topics");
    return response.data;
};

export const updateAdminTopicAccessType = async (topicId, accessType) => {
    const response = await axiosClient.patch(
        `/api/admin/topics/${topicId}/access-type`,
        { accessType }
    );
    return response.data;
};

export const approveAdminTopic = async (topicId) => {
    const response = await axiosClient.patch(`/api/admin/topics/${topicId}/approve`);
    return response.data;
};

export const rejectAdminTopic = async (topicId) => {
    const response = await axiosClient.patch(`/api/admin/topics/${topicId}/reject`);
    return response.data;
};
