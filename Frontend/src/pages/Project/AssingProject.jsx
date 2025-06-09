import React, { useState, useEffect } from "react";
import InputGroup from "../../common/InputGroup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const AssignProject = () => {
  const [formData, setFormData] = useState({
    project: "",
    teamMembers: [],
    teamName: "",
  });
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/get-project-bystatus/not started`
        );
        if (response.data && response.data.data) {
          setProjects(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Error fetching projects");
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/all-users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        console.log("Employees:", response.data);
        if (response.data && response.data.data) {
          setEmployees(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Error fetching employees");
      }
    };

    fetchProjects();
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTeamMembersChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        teamMembers: [...formData.teamMembers, value],
      });
    } else {
      setFormData({
        ...formData,
        teamMembers: formData.teamMembers.filter((member) => member !== value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    const payload = {
      projectId: formData.project,
      teamMembers: formData.teamMembers,
      teamName: formData.teamName,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/assign-team`,
        payload
      );
      console.log("Team assigned successfully:", response.data);
      toast.success("Team assigned successfully");
      setFormData({ project: "", teamMembers: [], teamName: "" });
    } catch (error) {
      console.error("Error assigning team:", error);
      toast.error("Error assigning team");
    }
  };

  return (
    <div className="max-w-full mx-auto bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-10 rounded-3xl shadow-2xl">
      <h2 className="text-4xl font-bold mb-8 text-center text-indigo-800">
        Assign Project
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select Project */}
        <div className="mb-6">
          <label
            className="block text-lg font-semibold mb-2 text-indigo-800"
            htmlFor="project"
          >
            Select Project
          </label>
          <select
            id="project"
            name="project"
            value={formData.project}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out shadow-sm"
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        {/* Select Team Members */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2 text-indigo-800">
            Select Team Members
          </label>
          <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
            {employees.map((employee) => (
              <label key={employee._id} className="flex items-center mb-3">
                <input
                  type="checkbox"
                  value={employee._id}
                  onChange={handleTeamMembersChange}
                  className="mr-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-lg text-gray-800">
                  {employee.name} ({employee.role})
                </span>
              </label>
            ))}
          </div>
        </div>
        {/* Team Name */}
        {/* <InputGroup
          label="Team Name"
          name="teamName"
          value={formData.teamName}
          onChange={handleInputChange}
          type="text"
        /> */}
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold text-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Assign Project
        </button>
      </form>
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

export default AssignProject;
