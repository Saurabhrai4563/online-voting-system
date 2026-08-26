import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        party: {
            type: String,
            required: true,
            trim: true,
        },

        symbol: {
            type: String,
            required: true,
            trim: true,
        },

        image: {
            type: String,
            default: "",
            trim: true,
        },

        manifesto: {
            type: String,
            default: "",
            trim: true,
        },

        election: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Election",
            required: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;