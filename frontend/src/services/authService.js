import axiosInstance from "./axiosInstance";

export const getAuthErrorMessage = (error, fallback) => {
    const detail = error.response?.data?.detail;

    if (typeof detail === "string") return detail;

    if (Array.isArray(detail)) {
        return detail.map((issue) => issue.msg).filter(Boolean).join(". ") || fallback;
    }

    return error.response?.data?.message || error.message || fallback;
};

export const registerUser = async (userData) => {

    const response = await axiosInstance.post(
        "/auth/register",
        userData
    );

    return response.data;
};

export const loginUser = async (userData) => {

    const response = await axiosInstance.post(
        "/auth/login",
        userData
    );

    return response.data;
};
