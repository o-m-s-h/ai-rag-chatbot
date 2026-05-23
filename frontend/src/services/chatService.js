import axiosInstance from "./axiosInstance";

export const sendMessage = async (
    conversationId,
    message
) => {

    const response = await axiosInstance.post(
        `/chat/${conversationId}`,
        {
            message
        }
    );

    return response.data;
};

export const getMessages = async (
    conversationId
) => {

    const response = await axiosInstance.get(
        `/chat/${conversationId}/messages`
    );

    return response.data;
};