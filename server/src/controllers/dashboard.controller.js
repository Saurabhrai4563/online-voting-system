import User from "../models/User.js";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import Vote from "../models/Vote.js";
import getElectionStatus from "../utils/getElectionStatus.js";

export const getAdminDashboard = async (req, res) => {
    try {
        // User Statistics
        const totalUsers = await User.countDocuments();

        const totalVoters = await User.countDocuments({
            role: "voter",
        });

        const totalAdmins = await User.countDocuments({
            role: "admin",
        });

        // Election Statistics
        const elections = await Election.find();

        const totalElections = elections.length;

        let activeElections = 0;
        let upcomingElections = 0;
        let completedElections = 0;

        elections.forEach((election) => {
            const status = getElectionStatus(
                election.startDate,
                election.endDate
            );

            if (status === "active") activeElections++;

            if (status === "upcoming") upcomingElections++;

            if (status === "completed") completedElections++;
        });

        // Candidate Statistics
        const totalCandidates =
            await Candidate.countDocuments();

        // Vote Statistics
        const totalVotes = await Vote.countDocuments();

        return res.status(200).json({
            success: true,
            message: "Dashboard statistics fetched successfully.",
            data: {
                totalUsers,
                totalVoters,
                totalAdmins,

                totalElections,
                activeElections,
                upcomingElections,
                completedElections,

                totalCandidates,
                totalVotes,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message,
        });
    }
};