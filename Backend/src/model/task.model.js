import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "in progress", "completed"],
            default: "pending",
        },
        dueDate: {
            type: Date,
            required: true,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        completedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
