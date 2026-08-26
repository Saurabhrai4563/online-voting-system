import api from "@/api/axious";

export const getAllElections = async (page = 1, limit = 10) => {
    const token = localStorage.getItem("token");

    const response = await api.get("/elections", {
        params: {
            page,
            limit,
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};
export const createElection = async (electionData) => {
    const token = localStorage.getItem("token");

    const response = await api.post("/elections", electionData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const getElectionById = async (id) => {
    const token = localStorage.getItem("token");

    const response = await api.get(`/elections/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};
export const updateElection = async (id, electionData) => {
    const token = localStorage.getItem("token");

    const response = await api.patch(`/elections/${id}`, electionData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const deleteElection = async (id) => {
    const token = localStorage.getItem("token");

    const response = await api.delete(`/elections/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};