import mongoose from "mongoose";
import Candidate from "../models/Candidate.js";
import Election from "../models/Election.js";
import Vote from "../models/Vote.js";
import getElectionStatus from "../utils/getElectionStatus.js";

export const castVote = async (req, res) => {
    try {
        const { candidateId, electionId } = req.body;

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(candidateId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid candidate ID.",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(electionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid election ID.",
            });
        }

        // Only voters can vote
        if (req.user.role !== "voter") {
            return res.status(403).json({
                success: false,
                message: "Only voters are allowed to cast a vote.",
            });
        }

        // Check election exists
        const election = await Election.findById(electionId);

        if (!election) {
            return res.status(404).json({
                success: false,
                message: "Election not found.",
            });
        }

        // Check election status
        const status = getElectionStatus(
            election.startDate,
            election.endDate
        );

        if (status !== "active") {
            return res.status(400).json({
                success: false,
                message: `Election is ${status}. Voting is not allowed.`,
            });
        }

        // Check candidate exists
        const candidate = await Candidate.findById(candidateId);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found.",
            });
        }

        // Candidate must belong to the selected election
        if (candidate.election.toString() !== electionId) {
            return res.status(400).json({
                success: false,
                message: "Candidate does not belong to this election.",
            });
        }

        // Prevent double voting
        const existingVote = await Vote.findOne({
            voter: req.user._id,
            election: electionId,
        });

        if (existingVote) {
            return res.status(409).json({
                success: false,
                message: "You have already voted in this election.",
            });
        }

        // Create vote
        const vote = await Vote.create({
            voter: req.user._id,
            candidate: candidateId,
            election: electionId,
        });

        return res.status(201).json({
            success: true,
            message: "Vote cast successfully.",
            data: vote,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "You have already voted in this election.",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message,
        });
    }
};