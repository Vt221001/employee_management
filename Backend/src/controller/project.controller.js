import { ApiResponse } from "../util/responseHandler.js";
import wrapAsyncUtil from "../util/wrapAsync.util.js";
import { Project } from "../model/project.model.js";
import { User } from "../model/user.model.js";

export const createProject = wrapAsyncUtil(async (req, res) => {
    const managerId = req.user?.id;

    console.log(managerId);

    if (!managerId) {
        return res
            .status(400)
            .json({ success: false, message: "Manager ID is required" });
    }

    const { name, description, startDate, endDate } = req.body;
    console.log(req.body);

    if (!name || !startDate || !endDate) {
        return res
            .status(400)
            .json({ success: false, message: "Missing required fields" });
    }

    const newProject = new Project({
        name,
        description,
        startDate,
        endDate,
        manager: managerId,
    });

    await newProject.save();

    return res.status(201).json(
        new ApiResponse({
            success: true,
            data: newProject,
            message: "Project created successfully",
        })
    );
});

export const getAllProjects = wrapAsyncUtil(async (req, res) => {
    const projects = await Project.find();

    if (!projects) {
        return res
            .status(404)
            .json(new ApiResponse(400, null, "No projects found"));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, projects, "Projects retrieved successfully")
        );
});

export const getProjectById = wrapAsyncUtil(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).populate({
        path: "manager",
        select: "name email",
    });

    if (!project) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Project not found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project retrieved successfully"));
});

export const updateProject = wrapAsyncUtil(async (req, res) => {
    const { projectId } = req.params;
    const updates = req.body;

    const project = await Project.findByIdAndUpdate(projectId, updates, {
        new: true,
    });
    if (!project) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Project not found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project updated successfully"));
});

export const deleteProject = wrapAsyncUtil(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Project not found"));
    }

    await User.updateMany(
        { projects: projectId },
        { $pull: { projects: projectId } }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Project deleted successfully"));
});

export const assignTeam = wrapAsyncUtil(async (req, res) => {
    const { projectId, teamMembers, teamName } = req.body;

    if (
        !projectId ||
        !teamMembers ||
        !Array.isArray(teamMembers) ||
        teamMembers.length === 0
    ) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid data"));
    }

    const project = await Project.findById(projectId);
    if (!project) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Project not found"));
    }

    project.team = teamMembers;
    project.teamName = teamName;
    project.status = "in progress";

    await project.save();

    await User.updateMany(
        { _id: { $in: teamMembers } },
        { $addToSet: { projects: projectId } }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Team assigned successfully"));
});

export const updateAssignedTeam = wrapAsyncUtil(async (req, res) => {
    const { projectId, teamMembers, teamName } = req.body;

    if (
        !projectId ||
        !teamMembers ||
        !Array.isArray(teamMembers) ||
        teamMembers.length === 0
    ) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid data"));
    }

    const project = await Project.findById(projectId);
    if (!project) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Project not found"));
    }

    await User.updateMany(
        { projects: projectId },
        { $pull: { projects: projectId } }
    );

    project.team = teamMembers;
    project.teamName = teamName;

    await project.save();

    await User.updateMany(
        { _id: { $in: teamMembers } },
        { $addToSet: { projects: projectId } }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Team updated successfully"));
});

export const removeTeamMember = wrapAsyncUtil(async (req, res) => {
    const { projectId, userId } = req.body;

    if (!projectId || !userId) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid data"));
    }

    const project = await Project.findById(projectId);
    if (!project) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Project not found"));
    }

    project.team = project.team.filter(
        (member) => member.toString() !== userId
    );

    await project.save();

    await User.findByIdAndUpdate(userId, {
        $pull: { projects: projectId },
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, project, "Team member removed successfully")
        );
});

export const addTeamMember = wrapAsyncUtil(async (req, res) => {
    const { projectId, userId } = req.body;

    if (!projectId || !userId) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid data"));
    }

    const project = await Project.findById(projectId);
    if (!project) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Project not found"));
    }

    project.team = [...project.team, userId];

    await project.save();

    await User.findByIdAndUpdate(userId, {
        $addToSet: { projects: projectId },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Team member added successfully"));
});

export const getProjectBystatus = wrapAsyncUtil(async (req, res) => {
    const { status } = req.params;

    const projects = await Project.find({ status })
        .populate("manager team")
        .lean();

    return res
        .status(200)
        .json(
            new ApiResponse(200, projects, "Projects retrieved successfully")
        );
});

export const getFreeUsers = wrapAsyncUtil(async (req, res) => {
    const freeUsers = await User.aggregate([
        {
            $lookup: {
                from: "projects",
                localField: "projects",
                foreignField: "_id",
                as: "projectDetails",
            },
        },
        {
            $match: {
                $or: [
                    { projectDetails: { $size: 0 } },
                    { "projectDetails.status": { $eq: "completed" } },
                ],
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                role: 1,
                department: 1,
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(200, freeUsers, "Free users retrieved successfully")
        );
});

export const getAllProjectUserAndTask = wrapAsyncUtil(async (req, res) => {
    const projects = await Project.find()
        .populate({ path: "team tasks", strictPopulate: false })
        .lean();
    const users = await User.find().lean();
    const tasks = projects.reduce(
        (acc, project) => acc.concat(project.tasks),
        []
    );

    const projectCount = projects.length;
    const userCount = users.length;
    const taskCount = tasks.length;

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { projectCount, userCount, taskCount },
                "Counts retrieved successfully"
            )
        );
});
