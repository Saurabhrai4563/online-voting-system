const getElectionStatus = (startDate, endDate) => {
    const today = new Date();

    if (today < startDate) {
        return "upcoming";
    }

    if (today > endDate) {
        return "completed";
    }

    return "active";
};

export default getElectionStatus;