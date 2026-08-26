import mongoose from "mongoose";

const electionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Election title is required"],
            trim: true,
            minlength: 3,
            maxlength: 100,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500,
        },

        startDate: {
            type: Date,
            required: [true, "Start date is required"],
        },

        endDate: {
            type: Date,
            required: [true, "End date is required"],
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

// Validate dates
// electionSchema.pre("save", function (next) {
//     if (this.endDate <= this.startDate) {
//         return next(new Error("End date must be after the start date."));
//     }

//     next();
// });

const Election = mongoose.model("Election", electionSchema);

export default Election;