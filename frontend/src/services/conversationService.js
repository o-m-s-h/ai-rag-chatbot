import axiosInstance from "./axiosInstance";

export const deleteConversation = async (conversationId) => {
    const response = await axiosInstance.delete(`/conversations/${conversationId}`);
    return response.data;
};

export const createConversation = async (chatData) => {

    const response = await axiosInstance.post(
        "/conversations/",
        chatData
    );

    return response.data;
};

export const getConversations = async () => {

    const response = await axiosInstance.get(
        "/conversations/"
    );

    return response.data;
};
