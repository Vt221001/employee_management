import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

const ProjectTable = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editProjectName, setEditProjectName] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [freeEmployees, setFreeEmployees] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/get-projects`
        );
        if (response.data && response.data.data) {
          setProjects(response.data.data);
          setFilteredProjects(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleFilterChange = (status) => {
    console.log("Filtering by status:", status);
    setStatusFilter(status);
    if (status === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((project) => project.status === status)
      );
    }
  };

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedProject) {
      setLoading(true);
      try {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/delete-project/${
            selectedProject._id
          }`
        );
        setProjects(
          projects.filter((project) => project._id !== selectedProject._id)
        );
        setFilteredProjects(
          filteredProjects.filter(
            (project) => project._id !== selectedProject._id
          )
        );
        setShowDeleteModal(false);
        setSelectedProject(null);
        toast.success("Project deleted successfully");
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setEditProjectName(project.name);
    setShowEditModal(true);
  };

  const handleEditConfirm = async () => {
    if (selectedProject) {
      setLoading(true);
      try {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/update-project/${
            selectedProject._id
          }`,
          {
            name: editProjectName,
          }
        );
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project._id === selectedProject._id
              ? { ...project, name: editProjectName }
              : project
          )
        );
        setFilteredProjects((prevFilteredProjects) =>
          prevFilteredProjects.map((project) =>
            project._id === selectedProject._id
              ? { ...project, name: editProjectName }
              : project
          )
        );
        setShowEditModal(false);
        setSelectedProject(null);
        toast.success("Project updated successfully");
      } catch (error) {
        console.error("Error updating project:", error);
        toast.error("Failed to update project");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewClick = async (project) => {
    setSelectedProject(project);
    setShowViewModal(true);
    setLoading(true);
    console.log("Selected Project:", project);

    try {
      console.log("started");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-team-member/${project._id}`
      );
      setTeamMembers(response.data.data);
      console.log("Team Members:", response.data.data);
      const freeEmployeeResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/free-employee`
      );
      console.log("Free Employees:", freeEmployeeResponse.data.data);
      setFreeEmployees(freeEmployeeResponse.data.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  const refreshTeamMembers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-team-member/${
          selectedProject._id
        }`
      );
      setTeamMembers(response.data.data);
      const freeEmployeeResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/free-employee`
      );
      setFreeEmployees(freeEmployeeResponse.data.data);
    } catch (error) {
      console.error("Error refreshing team members:", error);
      toast.error("Failed to refresh team members");
    }
  };

  const handleAddTeamMember = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/add-team-member`,
        {
          projectId: selectedProject._id,
          userId: selectedTeamMembers,
        }
      );
      setTeamMembers(
        freeEmployees.filter((employee) =>
          selectedTeamMembers.includes(employee._id)
        )
      );
      setSelectedTeamMembers([]);
      await refreshTeamMembers();
      toast.success("Team members added successfully");
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTeamMember = async (userId) => {
    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/remove-team-member`,
        {
          projectId: selectedProject._id,
          userId,
        }
      );
      setTeamMembers(teamMembers.filter((member) => member._id !== userId));
      toast.success("Team member removed successfully");
      await refreshTeamMembers();
    } catch (error) {
      console.error("Error removing team member:", error);
      toast.error("Failed to remove team member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-100 via-purple-50 to-pink-100 p-8 rounded-md shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
        All Projects
      </h2>

      {loading && (
        <div className="flex justify-center mb-4">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      )}

      <div className="flex justify-center mb-6 space-x-4">
        <button
          className={`py-2 px-4 rounded-lg font-semibold ${
            statusFilter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleFilterChange("all")}
        >
          All Projects
        </button>
        <button
          className={`py-2 px-4 rounded-lg font-semibold ${
            statusFilter === "in progress"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleFilterChange("in progress")}
        >
          In Progress
        </button>
        <button
          className={`py-2 px-4 rounded-lg font-semibold ${
            statusFilter === "completed"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleFilterChange("completed")}
        >
          Completed
        </button>
        <button
          className={`py-2 px-4 rounded-lg font-semibold ${
            statusFilter === "not started"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleFilterChange("not started")}
        >
          Upcoming
        </button>
      </div>

      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <tr>
            <th className="py-4 px-6 border-b text-left font-semibold">ID</th>
            <th className="py-4 px-6 border-b text-left font-semibold">
              Title
            </th>
            <th className="py-4 px-6 border-b text-left font-semibold">
              Project Manager
            </th>

            <th className="py-4 px-6 border-b text-left font-semibold">
              Start Date
            </th>
            <th className="py-4 px-6 border-b text-left font-semibold">
              Deadline
            </th>

            <th className="py-4 px-6 border-b text-left font-semibold">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project, index) => (
            <tr
              key={project._id}
              className="bg-white hover:bg-gray-100 transition duration-200"
            >
              <td className="py-4 px-6 ">{index + 1}</td>
              <td className="py-4 px-6  font-medium text-blue-700">
                {project.name}
              </td>
              <td className="py-4 px-6 ">{project.manager?.name || "N/A"}</td>
              <td className="py-4 px-6 ">
                {new Date(project.startDate).toLocaleDateString()}
              </td>
              <td className="py-4 px-6 ">
                {new Date(project.endDate).toLocaleDateString()}
              </td>

              <td className="py-4 px-6  flex space-x-4">
                <button
                  className="text-blue-600 hover:text-blue-800 transition duration-200"
                  onClick={() => handleEditClick(project)}
                >
                  <FaEdit size={18} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800 transition duration-200"
                  onClick={() => handleDeleteClick(project)}
                >
                  <FaTrash size={18} />
                </button>
                <button
                  className="text-green-600 hover:text-green-800 transition duration-200"
                  onClick={() => handleViewClick(project)}
                >
                  <FaEye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg p-6 w-96 z-10 relative">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this project?</p>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg p-6 w-96 z-10 relative">
            <h2 className="text-xl font-bold mb-4">Edit Project</h2>
            <input
              type="text"
              value={editProjectName}
              onChange={(e) => setEditProjectName(e.target.value)}
              className="w-full mb-4 p-2 border rounded-lg"
              placeholder="Project Name"
            />
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleEditConfirm}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Team Members Modal */}
      {showViewModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg p-6 w-96 z-10 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Team Members</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                &times;
              </button>
            </div>
            <ul>
              {teamMembers.map((member) => (
                <li
                  key={member._id}
                  className="flex justify-between items-center mb-2"
                >
                  <span>{member.name}</span>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-lg"
                    onClick={() => handleRemoveTeamMember(member._id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Add Team Members:</h3>
              {freeEmployees?.map((employee) => (
                <div key={employee._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    value={employee._id}
                    checked={selectedTeamMembers.includes(employee._id)}
                    onChange={(e) => {
                      const { checked, value } = e.target;
                      setSelectedTeamMembers((prev) =>
                        checked
                          ? [...prev, value]
                          : prev.filter((id) => id !== value)
                      );
                    }}
                    className="mr-2"
                  />
                  <span>{employee.name}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddTeamMember}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              Add Team Member
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ProjectTable;
