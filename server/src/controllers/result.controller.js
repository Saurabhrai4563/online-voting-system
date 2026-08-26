import mongoose from "mongoose";
import Election from "../models/Election.js";
import Vote from "../models/Vote.js";
import getElectionStatus from "../utils/getElectionStatus.js";

export const getElectionResults = async (req, res) => {
    try {
        const { electionId } = req.params;

        // Validate Election ID
        if (!mongoose.Types.ObjectId.isValid(electionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid election ID.",
            });
        }

        // Check Election Exists
        const election = await Election.findById(electionId);

        if (!election) {
            return res.status(404).json({
                success: false,
                message: "Election not found.",
            });
        }

        // Check Election Status
        const status = getElectionStatus(
            election.startDate,
            election.endDate
        );

        if (status !== "completed") {
            return res.status(400).json({
                success: false,
                message: "Results are available only after the election is completed.",
            });
        }

        // Aggregation Pipeline
        const results = await Vote.aggregate([
            {
                $match: {
                    election: new mongoose.Types.ObjectId(electionId),
                },
            },
            {
                $group: {
                    _id: "$candidate",
                    totalVotes: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    totalVotes: -1,
                },
            },
            {
                $lookup: {
                    from: "candidates",
                    localField: "_id",
                    foreignField: "_id",
                    as: "candidate",
                },
            },
            {
                $unwind: "$candidate",
            },
            {
                $lookup: {
                    from: "users",
                    localField: "candidate.user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $project: {
                    _id: 0,
                    candidateId: "$candidate._id",
                    candidateName: "$user.name",
                    party: "$candidate.party",
                    symbol: "$candidate.symbol",
                    image: "$candidate.image",
                    manifesto: "$candidate.manifesto",
                    totalVotes: 1,
                },
            },
        ]);

        // Election Details
        const electionDetails = {
            id: election._id,
            title: election.title,
            status,
        };

        // Total Candidates
        const totalCandidates = results.length;

        // Total Votes
        const totalVotes = results.reduce(
            (sum, candidate) => sum + candidate.totalVotes,
            0
        );

        // Add Vote Percentage
        const updatedResults = results.map((candidate) => ({
            ...candidate,
            votePercentage:
                totalVotes === 0
                    ? "0%"
                    : `${(
                        (candidate.totalVotes / totalVotes) *
                        100
                    ).toFixed(2)}%`,
        }));

        // Winner
        const winner =
            updatedResults.length > 0 ? updatedResults[0] : null;

        // Winning Margin
        let winningMargin = null;

        if (updatedResults.length > 1) {
            winningMargin =
                updatedResults[0].totalVotes -
                updatedResults[1].totalVotes;
        }
        if (updatedResults.length > 1) {
            winningMargin =
                updatedResults[0].totalVotes -
                updatedResults[1].totalVotes;
        }

        // Tie Detection
        const winners = updatedResults.filter(
            (candidate) =>
                winner &&
                candidate.totalVotes === winner.totalVotes
        );

        const isTie = winners.length > 1;

        return res.status(200).json({
            success: true,
            message: "Election results fetched successfully.",

            election: electionDetails,

            totalCandidates,
            totalVotes,

            isTie,

            winner: isTie ? null : winner,

            winners: isTie ? winners : [],

            winningMargin: isTie ? 0 : winningMargin,

            data: updatedResults,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message,
        });
    }
};