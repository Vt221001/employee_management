import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["not started", "in progress", "completed", "on hold"],
        default: "not started",
    },
    team: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
   
});

export const Project = mongoose.model("Project", projectSchema);
