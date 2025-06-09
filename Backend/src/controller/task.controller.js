import mongoose from "mongoose";
import { Project } from "../model/project.model.js";
import { Task } from "../model/task.model.js";
import { User } from "../model/user.model.js";
import { ApiResponse } from "../util/responseHandler.js";
import wrapAsyncUtil from "../util/wrapAsync.util.js";
import { io } from "../index.js";

export const getTeamMemberByProjectId = wrapAsyncUtil(
    async (req, res, next) => {
        const { projectId } = req.params;

        const project = await Project.findById(projectId).populate(
            "team",
            "name"
        );

        if (!project) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Project not found"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    project.team,
                    "Team members retrieved successfully"
                )
            );
    }
);

export const createTask = wrapAsyncUtil(async (req, res, next) => {
    const { title, description, assignedTo, projectId, dueDate, priority } =
        req.body;
    const project = await Project.findById(projectId);
    if (!project) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Project not found"));
    }

    const user = await User.findById(assignedTo);
    if (!user) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "User not found"));
    }

    if (!project.team.includes(assignedTo)) {
        return res
            .status(400)
            .json(
                new ApiResponse(400, null, "User is not part of the project")
            );
    }

    const task = new Task({
        title,
        description,
        assignedTo,
        project: projectId,
        dueDate,
        priority,
    });

    await task.save();

    console.log(`sending to room: ${assignedTo}`);
    io.to(assignedTo.toString()).emit("newTask", {
        message: `New task assigned: ${title}`,
        task,
    });

    console.log(`Notification sent to ${task._id}`);

    return res
        .status(201)
        .json(new ApiResponse(201, task, "Task created successfully"));
});

export const getTaskByProjectId = wrapAsyncUtil(async (req, res, next) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Project not found"));
    }

    const tasks = await Task.find({
        project: projectId,
    }).populate("assignedTo", "name");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tasks,
                "Tasks retrieved successfully for the project"
            )
        );
});

export const getTaskByProjectIdAndTaskId = wrapAsyncUtil(
    async (req, res, next) => {
        const { projectId, taskId } = req.body;

        const project = await Project.findById(projectId);

        if (!project) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Project not found"));
        }

        const task = await Task.findOne({
            project: projectId,
            _id: taskId,
        }).populate("assignedTo", "name");

        if (!task) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Task not found"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    task,
                    "Task retrieved successfully for the project"
                )
            );
    }
);

export const updateTask = wrapAsyncUtil(async (req, res, next) => {
    const { taskId } = req.params;
    const { title, description, assignedTo, projectId, dueDate, priority } =
        req.body;

    const task = await Task.findById(taskId);
    if (!task) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Task not found"));
    }

    const project = await Project.findById(projectId || task.project);
    if (!project) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Project not found"));
    }

    const user = await User.findById(assignedTo || task.assignedTo);
    if (!user) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "User not found"));
    }

    if (projectId && !project.team.includes(assignedTo)) {
        return res
            .status(400)
            .json(
                new ApiResponse(400, null, "User is not part of the project")
            );
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.assignedTo = assignedTo || task.assignedTo;
    task.project = projectId || task.project;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;

    await task.save();

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task updated successfully"));
});

export const deleteTask = wrapAsyncUtil(async (req, res, next) => {
    const { taskId, projectId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Task not found"));
    }

    const project = await Project.findById(projectId);
    if (!project) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Project not found"));
    }

    if (task.project.toString() !== projectId) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    null,
                    "Task does not belong to the project"
                )
            );
    }

    const user = await User.findById(task.assignedTo);
    if (!user) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "User not found"));
    }

    await Task.deleteOne({ _id: taskId });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

export const getTaskByUserId = wrapAsyncUtil(async (req, res, next) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Invalid user ID"));
    }

    const user = await User.findById(userId);
    if (!user) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "User not found"));
    }

    const tasks = await Task.find({ assignedTo: userId })
        .populate({
            path: "project",
            select: "name description",
        })
        .sort({ dueDate: 1 })
        .exec();

    if (!tasks || tasks.length === 0) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "No tasks found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { tasks }, "Tasks retrieved successfully"));
});

export const updateTaskStatus = wrapAsyncUtil(async (req, res, next) => {
    const { taskId, status } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Task not found"));
    }

    task.status = status;
    if (status === "completed") {
        task.completedAt = new Date();
    }

    await task.save();

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task status updated successfully"));
});
