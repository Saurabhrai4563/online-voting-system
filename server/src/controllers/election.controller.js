import Election from "../models/Election.js";
import getElectionStatus from "../utils/getElectionStatus.js";
import mongoose, { deleteModel } from "mongoose";
import Candidate from "../models/Candidate.js";

export const getElectionCandidates = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate Election ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid election ID.",
            });
        }

        // Check Election Exists
        const election = await Election.findById(id);

        if (!election) {
            return res.status(404).json({
                success: false,
                message: "Election not found.",
            });
        }

        // Aggregation Pipeline
        const candidates = await Candidate.aggregate([
            {
                $match: {
                    election: new mongoose.Types.ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
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
                    candidateId: "$_id",
                    name: "$user.name",
                    email: "$user.email",
                    party: 1,
                    symbol: 1,
                    image: 1,
                    manifesto: 1,
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            message: "Election candidates fetched successfully.",
            election: {
                id: election._id,
                title: election.title,
                status: "completed", // or use getElectionStatus(...) if you want the live status
            },
            totalCandidates: candidates.length,
            data: candidates,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message,
        });
    }
};
export const createElection = async (req, res) => {
    try {
        const { title, description, startDate, endDate } = req.body;

        // Required field validation
        if (!title?.trim() || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Title, start date, and end date are required.",
            });
        }

        // Validate date format
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format.",
            });
        }

        // Validate date range
        if (end <= start) {
            return res.status(400).json({
                success: false,
                message: "End date must be after the start date.",
            });
        }

        // Create election
        const election = await Election.create({
            title: title.trim(),
            description: description?.trim() || "",
            startDate: start,
            endDate: end,
            createdBy: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Election created successfully.",
            data: election,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getAllElections = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Validation
        if (page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                message: "Page and limit must be greater than 0.",
            });
        }

        if (limit > 100) {
            return res.status(400).json({
                success: false,
                message: "Limit cannot exceed 100.",
            });
        }

        const skip = (page - 1) * limit;

        // Fetch elections
        const elections = await Election.find({})
            .sort({ createdAt: -1 })
            .populate("createdBy", "name email")
            .skip(skip)
            .limit(limit);

        // Total documents
        const totalElections = await Election.countDocuments();

        // Add status
        const electionsWithStatus = elections.map((election) => ({
            ...election.toObject(),
            status: getElectionStatus(
                election.startDate,
                election.endDate
            ),
        }));

        // Sort: Active -> Upcoming -> Completed
        const statusPriority = {
            active: 1,
            upcoming: 2,
            completed: 3,
        };

        electionsWithStatus.sort((a, b) => {
            // First sort by status
            if (statusPriority[a.status] !== statusPriority[b.status]) {
                return statusPriority[a.status] - statusPriority[b.status];
            }

            // Active → ending soonest first
            if (a.status === "active") {
                return new Date(a.endDate) - new Date(b.endDate);
            }

            // Upcoming → starting soonest first
            if (a.status === "upcoming") {
                return new Date(a.startDate) - new Date(b.startDate);
            }

            // Completed → recently completed first
            return new Date(b.endDate) - new Date(a.endDate);
        });

        const totalPages = Math.ceil(totalElections / limit);

        return res.status(200).json({
            success: true,
            message:
                electionsWithStatus.length > 0
                    ? "Elections fetched successfully."
                    : "No elections found.",
            data: electionsWithStatus,
            pagination: {
                currentPage: page,
                totalPages,
                totalElections,
                limit,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getElectionById = async (req, res) => {

    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid election ID.",
            });
        }

        const election = await Election.findById(id)
            .populate({
                path: "createdBy",
                select: "name email",
            })

        if (!election) {
            return res.status(404).json({
                success: false,
                message: "Election not found.",
            });
        }

        const electionData = {
            ...election.toObject(),
            status: getElectionStatus(
                election.startDate,
                election.endDate
            ),
        };

        return res.status(200).json({
            success: true,
            message: "Election fetched successfully.",
            data: electionData,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateElection = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid election ID.",
            });
        }

        // Find election
        const election = await Election.findById(id);

        if (!election) {
            return res.status(404).json({
                success: false,
                message: "Election not found.",
            });
        }

        const { title, description, startDate, endDate } = req.body;

        // Use existing dates if new ones are not provided
        const updatedStartDate = startDate
            ? new Date(startDate)
            : election.startDate;

        const updatedEndDate = endDate
            ? new Date(endDate)
            : election.endDate;

        // Validate dates
        if (
            isNaN(updatedStartDate.getTime()) ||
            isNaN(updatedEndDate.getTime())
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format.",
            });
        }

        // Validate date range
        if (updatedEndDate <= updatedStartDate) {
            return res.status(400).json({
                success: false,
                message: "End date must be after the start date.",
            });
        }

        // Update only the fields provided
        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Title cannot be empty.",
                });
            }

            election.title = title.trim();
        }

        if (description !== undefined) {
            election.description = description?.trim();
        }

        if (startDate) {
            election.startDate = updatedStartDate;
        }

        if (endDate) {
            election.endDate = updatedEndDate;
        }

        // Save updated document
        await election.save();

        // Populate createdBy
        await election.populate({
            path: "createdBy",
            select: "name email",
        });

        // Add dynamic status
        const electionData = {
            ...election.toObject(),
            status: getElectionStatus(
                election.startDate,
                election.endDate
            ),
        };

        return res.status(200).json({
            success: true,
            message: "Election updated successfully.",
            data: electionData,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteElection = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid election ID.",
            });
        }

        // Find election
        const election = await Election.findById(id);

        if (!election) {
            return res.status(404).json({
                success: false,
                message: "Election not found.",
            });
        }

        // Delete election
        await election.deleteOne();

        return res.status(200).json({
            success: true,
            message: `"${election.title}" election deleted successfully.`,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
