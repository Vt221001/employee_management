import express from "express";
import {
    createTask,
    deleteTask,
    getTaskByProjectId,
    getTaskByProjectIdAndTaskId,
    getTaskByUserId,
    getTeamMemberByProjectId,
    updateTask,
    updateTaskStatus,
} from "../controller/task.controller.js";

const router = express.Router();

router.get("/get-team-member/:projectId", getTeamMemberByProjectId);
router.post("/create-task", createTask);
router.put("/update-task-status", updateTaskStatus);
router.get("/get-tasks/:projectId", getTaskByProjectId);
router.post("/get-project-task-by-task-id", getTaskByProjectIdAndTaskId);
router.put("/update-task/:taskId", updateTask);
router.delete("/delete-task", deleteTask);
router.get("/get-task-by-userid/:userId", getTaskByUserId);

export { router as taskRouter };
