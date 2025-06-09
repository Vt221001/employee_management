import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormField from "../../common/FormField";

const AssignTask = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("");

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
        toast.error("Failed to fetch projects");
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
      toast.error("Failed to fetch team members");
    }
  };

  const handleAssignTask = async () => {
    try {
      const payload = {
        title: taskTitle,
        description: taskDescription,
        assignedTo: selectedEmployeeId,
        projectId: selectedProjectId,
        dueDate: taskDueDate,
        priority: taskPriority,
      };
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/create-task`,
        payload
      );
      toast.success("Task assigned successfully");
      setSelectedProjectId("");
      setTeamMembers([]);
      setSelectedEmployeeId("");
      setTaskTitle("");
      setTaskDescription("");
      setTaskDueDate("");
      setTaskPriority("");
    } catch (error) {
      console.error("Error assigning task:", error);
      toast.error("Failed to assign task");
    }
  };

  return (
    <div className="max-w-full mx-auto bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-10 rounded-3xl shadow-2xl">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-blue-900 tracking-wide">
        Assign Task
      </h2>

      <div className="mb-6">
        <label className="block text-lg text-gray-800 font-semibold mb-2">
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
          <label className="block text-lg text-gray-800 font-semibold mb-2">
            Select Employee
          </label>
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out shadow-sm"
          >
            <option value="" disabled>
              Select an employee
            </option>
            {teamMembers.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedEmployeeId && (
        <>
          <FormField
            name="taskTitle"
            label="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          <FormField
            name="taskDescription"
            label="Task Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            type="textarea"
          />

          <FormField
            name="taskDueDate"
            label="Due Date"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
            type="date"
          />

          <div className="mb-6">
            <label className="block text-lg text-gray-800 font-semibold mb-2">
              Priority
            </label>
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out shadow-sm"
            >
              <option value="" disabled>
                Select priority
              </option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button
            onClick={handleAssignTask}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-bold text-lg shadow-md transform transition-all duration-300 hover:scale-105"
          >
            Assign Task
          </button>
        </>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AssignTask;
