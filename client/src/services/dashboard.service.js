import api from "../api/axious";

export const getDashboardStats = async () => {
    const token = localStorage.getItem("token");

    const response = await api.get("/dashboard/admin", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};