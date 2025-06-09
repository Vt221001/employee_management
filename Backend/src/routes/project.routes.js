import express from "express";
import {
    addTeamMember,
    assignTeam,
    createProject,
    deleteProject,
    getAllProjects,
    getFreeUsers,
    getProjectById,
    getProjectBystatus,
    removeTeamMember,
    updateAssignedTeam,
    updateProject,
} from "../controller/project.controller.js";
import { authenticateToken } from "../middleware/authenticateToken.middleware.js";

const router = express.Router();

router.post("/create-project", authenticateToken, createProject);

router.get("/get-projects", getAllProjects);
router.get("/get-project/:projectId", getProjectById);
router.put("/update-project/:projectId", updateProject);
router.delete("/delete-project/:projectId", deleteProject);
router.post("/assign-team", assignTeam);
router.get("/get-project-bystatus/:status", getProjectBystatus);
router.get("/free-employee", getFreeUsers);
router.put("/update-assign-team", updateAssignedTeam);
router.put("/remove-team-member", removeTeamMember);
router.put("/add-team-member", addTeamMember);

export { router as projectRouter };
