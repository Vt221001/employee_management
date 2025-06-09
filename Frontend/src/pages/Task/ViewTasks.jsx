import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaClock, FaSpinner } from "react-icons/fa";

const ViewTasks = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeamMemberId, setSelectedTeamMemberId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/get-project-bystatus/in progress`
        );
        if (response.data && response.data.data) {
          setProjects(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const handleProjectChange = async (projectId) => {
    setSelectedProjectId(projectId);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-team-member/${projectId}`
      );
      if (response.data.success) {
        setTeamMembers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const handleTeamMemberChange = async (teamMemberId) => {
    setSelectedTeamMemberId(teamMemberId);
    setTasks([]);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/get-task-by-userid/${teamMemberId}`
      );
      console.log("Tasks:", response.data.data);
      if (response.data.success) {
        setTasks(response.data.data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCardClick = (task) => {
    setSelectedTask(task);
    setUpdatedStatus(task.status);
    setShowUpdateModal(true);
  };

  const handleStatusUpdate = async () => {
    if (selectedTask) {
      try {
        const payload = {
          taskId: selectedTask._id,
          status: updatedStatus,
        };
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/update-task-status`,
          payload
        );
        setShowUpdateModal(false);
        setSelectedTask(null);
        setUpdatedStatus("");
        // Fetch updated tasks
        handleTeamMemberChange(selectedTeamMemberId);
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
  };

  const getCardStyles = (status, priority) => {
    let bgColor = "bg-white";
    let textColor = "text-blue-800";
    let icon = <FaSpinner className="text-blue-800" />;
    if (status === "completed") {
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      icon = <FaCheckCircle className="text-green-800" />;
    } else if (status === "pending") {
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      icon = <FaClock className="text-yellow-800" />;
    } else if (status === "in progress") {
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      icon = <FaSpinner className="text-blue-800 animate-spin" />;
    }

    if (priority === "high") {
      bgColor = "bg-red-100";
      textColor = "text-red-800";
    } else if (priority === "medium") {
      bgColor = "bg-yellow-200";
      textColor = "text-yellow-900";
    } else if (priority === "low") {
      bgColor = "bg-green-200";
      textColor = "text-green-900";
    }

    return { bgColor, textColor, icon };
  };

  return (
    <div className="max-w-full mx-auto bg-gradient-to-r from-blue-100 via-purple-50 to-pink-100 p-10 rounded-3xl shadow-2xl">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-blue-900">
        View Tasks
      </h2>

      <div className="mb-6">
        <label className="block text-lg text-gray-800 font-bold mb-3">
          Select Project
        </label>
        <select
          value={selectedProjectId}
          onChange={(e) => handleProjectChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out shadow-sm"
        >
          <option value="" disabled>
            Select a project
          </option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {selectedProjectId && (
        <div className="mb-6">
          <label className="block text-lg text-gray-800 font-bold mb-3">
            Select Team Member
          </label>
          <select
            value={selectedTeamMemberId}
            onChange={(e) => handleTeamMemberChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out shadow-sm"
          >
            <option value="" disabled>
              Select a team member
            </option>
            {teamMembers.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedTeamMemberId && tasks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-3xl font-bold mb-6 text-blue-700">
            Assigned Tasks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => {
              const { bgColor, textColor, icon } = getCardStyles(
                task.status,
                task.priority
              );
              return (
                <div
                  key={task._id}
                  className={`p-6 rounded-2xl cursor-pointer shadow-lg transform transition hover:scale-105 hover:shadow-2xl ${bgColor} ${textColor}`}
                  onClick={() => handleCardClick(task)}
                  title="Click to update status"
                >
                  <div className="flex items-center mb-4">
                    {icon}
                    <h4 className="text-2xl font-bold ml-3 transition duration-200 ease-in-out hover:text-indigo-500">
                      {task.title}
                    </h4>
                  </div>
                  <p className="text-gray-700 mb-4 transition duration-200 ease-in-out hover:text-indigo-500">
                    {task.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="inline-block px-3 py-1 bg-white text-blue-700 font-medium rounded-full">
                      Status: {task.status}
                    </span>
                    <span
                      className={`inline-block px-3 py-1 ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      } font-medium rounded-full`}
                    >
                      Priority: {task.priority}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-semibold">Due Date:</p>
                    <p className="text-lg transition duration-200 ease-in-out hover:text-indigo-500">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedTeamMemberId && tasks.length === 0 && (
        <div className="mt-8">
          <p className="text-lg text-gray-700">
            No tasks assigned to this team member.
          </p>
        </div>
      )}

      {showUpdateModal && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg p-6 w-96 z-10 relative">
            <h2 className="text-2xl font-bold mb-4">Update Task Status</h2>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">Status</label>
              <select
                value={updatedStatus}
                onChange={(e) => setUpdatedStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out shadow-sm"
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button
              onClick={handleStatusUpdate}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Update Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTasks;
