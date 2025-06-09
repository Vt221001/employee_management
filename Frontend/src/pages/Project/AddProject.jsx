import React from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import FormField from "../../common/FormField";

const AddProject = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Form Data:", data);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/create-project`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("Project added successfully:", response.data);
      toast.success("Project added successfully!");
      reset();
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Error adding project. Please try again!");
    }
  };

  return (
    <div className="max-w-full mx-auto bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-10 rounded-3xl shadow-2xl">
      <h2 className="text-4xl font-bold mb-8 text-center text-indigo-800">
        Add New Project
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Project Name */}
        <FormField
          name="name"
          label="Project Name"
          type="text"
          {...register("name", { required: "Project name is required" })}
          error={errors.name}
        />
        {/* Description */}
        <FormField
          name="description"
          label="Description"
          type="textarea"
          {...register("description", { required: "Description is required" })}
          error={errors.description}
        />
        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="startDate"
            label="Start Date"
            type="date"
            {...register("startDate", { required: "Start date is required" })}
            error={errors.startDate}
          />
          <FormField
            name="endDate"
            label="End Date"
            type="date"
            {...register("endDate", { required: "End date is required" })}
            error={errors.endDate}
          />
        </div>
        {/* Status */}
        <div className="mb-6">
          <label
            className="block text-lg font-semibold mb-2 text-indigo-800"
            htmlFor="status"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            {...register("status", { required: "Status is required" })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out shadow-sm"
          >
            <option value="not started">Not Started</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on hold">On Hold</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold text-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Add Project
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddProject;
