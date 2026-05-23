import axiosInstance from "./axiosInstance";

export const uploadDocument = async (
    conversationId,
    file
) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await axiosInstance.post(
        `/upload/${conversationId}`,
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data"
            }
        }
    );

    return response.data;
};