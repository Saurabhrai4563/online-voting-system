import mongoose from "mongoose";
import Candidate from "../models/Candidate.js";
import Election from "../models/Election.js";
import User from "../models/User.js";

export const createCandidate = async (req, res) => {
    try {
        const {
            user,
            party,
            symbol,
            image,
            manifesto,
            election,
        } = req.body;

        // Required fields
        if (!user || !party?.trim() || !symbol?.trim() || !election) {
            return res.status(400).json({
                success: false,
                message: "User, party, symbol and election are required.",
            });
        }

        // Validate ObjectIds
        if (
            !mongoose.Types.ObjectId.isValid(user) ||
            !mongoose.Types.ObjectId.isValid(election)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID or Election ID.",
            });
        }

        // Check user exists
        // Check user exists
        const existingUser = await User.findById(user);

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Only voters can become candidates
        if (existingUser.role !== "voter") {
            return res.status(400).json({
                success: false,
                message: "Only voters can be selected as candidates.",
            });
        }

        // Check election exists
        const existingElection = await Election.findById(election);

        if (!existingElection) {
            return res.status(404).json({
                success: false,
                message: "Election not found.",
            });
        }

        // Prevent duplicate candidate in same election
        const existingCandidate = await Candidate.findOne({
            user,
            election,
        });

        if (existingCandidate) {
            return res.status(409).json({
                success: false,
                message: "User is already a candidate in this election.",
            });
        }

        // Create candidate
        const candidate = await Candidate.create({
            user,
            party: party.trim(),
            symbol: symbol.trim(),
            image: image?.trim() || "",
            manifesto: manifesto?.trim() || "",
            election,
            createdBy: req.user._id,
        });

        // Populate references
        await candidate.populate([
            {
                path: "user",
                select: "name email",
            },
            {
                path: "election",
                select: "title startDate endDate",
            },
            {
                path: "createdBy",
                select: "name email",
            },
        ]);

        return res.status(201).json({
            success: true,
            message: "Candidate created successfully.",
            data: candidate,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllCandidates = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { election } = req.query;

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

        const filter = {};

        if (election) {

            if (!mongoose.Types.ObjectId.isValid(election)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid election ID.",
                });
            }

            filter.election = election;
        }

        const skip = (page - 1) * limit;

        const candidates = await Candidate.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: "user",
                select: "name email",
            })
            .populate({
                path: "election",
                select: "title startDate endDate",
            })
            .populate({
                path: "createdBy",
                select: "name email",
            });

        const totalCandidates = await Candidate.countDocuments(filter);

        const totalPages = Math.ceil(totalCandidates / limit);

        return res.status(200).json({
            success: true,
            message:
                totalCandidates > 0
                    ? "Candidates fetched successfully."
                    : "No candidates found.",
            data: candidates,
            pagination: {
                currentPage: page,
                totalPages,
                totalCandidates,
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

export const getCandidateById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid candidate ID.",
            });
        }

        const candidate = await Candidate.findById(id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found.",
            });
        }

        await candidate.populate([
            {
                path: "user",
                select: "name email",
            },
            {
                path: "election",
                select: "title startDate endDate",
            },
            {
                path: "createdBy",
                select: "name email",
            },
        ]);

        return res.status(200).json({
            success: true,
            message: "Candidate fetched successfully.",
            data: candidate,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const updateCandidate = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid candidate ID.",
            });
        }

        const candidate = await Candidate.findById(id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found.",
            });
        }

        const { party, symbol, image, manifesto } = req.body;

        if (party !== undefined) {
            if (!party.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Party cannot be empty.",
                });
            }

            candidate.party = party.trim();
        }

        if (symbol !== undefined) {
            if (!symbol.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Symbol cannot be empty.",
                });
            }

            candidate.symbol = symbol.trim();
        }

        if (image !== undefined) {
            candidate.image = image.trim();
        }

        if (manifesto !== undefined) {
            candidate.manifesto = manifesto.trim();
        }

        await candidate.save();

        await candidate.populate([
            {
                path: "user",
                select: "name email",
            },
            {
                path: "election",
                select: "title startDate endDate",
            },
            {
                path: "createdBy",
                select: "name email",
            },
        ]);

        return res.status(200).json({
            success: true,
            message: "Candidate updated successfully.",
            data: candidate,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteCandidate = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid candidate ID.",
            });
        }

        const candidate = await Candidate.findById(id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found.",
            });
        }

        await candidate.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Candidate deleted successfully.",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};