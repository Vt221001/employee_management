import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormField from "../common/FormField";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserForm({ initialData, onSubmitSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let response;
      if (initialData) {
        response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/update-user/${
            initialData._id
          }`,
          data
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user-register`,
          data
        );
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(
          initialData
            ? "User updated successfully!"
            : "User added successfully!"
        );

        // Call onSubmitSuccess only when editing an existing user
        if (initialData && onSubmitSuccess) {
          onSubmitSuccess(response.data); // Pass the updated user data
        }

        navigate("/management/view-team");
      } else {
        throw new Error("Unexpected response from the server");
      }

      reset();
    } catch (error) {
      console.error("API Error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-5xl mx-auto mt-10 p-6 rounded-lg shadow-lg"
      style={{ background: "linear-gradient(135deg, #f29f67, #e6e1ff)" }}
    >
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        {initialData ? "Edit User" : "Add User"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            label="Name"
            name="name"
            {...register("name", { required: "Name is required" })}
            error={errors.name}
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
            error={errors.email}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {!initialData && (
            <FormField
              label="Password"
              name="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters required" },
              })}
              error={errors.password}
            />
          )}
          <FormField
            label="Phone"
            name="phone"
            type="number"
            min="0"
            {...register("phone", {
              required: "Phone is required",
              minLength: { value: 10, message: "Must be 10 digits" },
            })}
            error={errors.phone}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField
            label="Photo URL"
            name="photo"
            type="url"
            {...register("photo")}
            error={errors.photo}
          />
          <FormField
            label="Role"
            name="role"
            type="select"
            options={[
              { value: "Admin", label: "Admin" },
              { value: "TeamMember", label: "TeamMember" },
              { value: "ProjectManager", label: "ProjectManager" },
              { value: "Client", label: "Client" },
            ]}
            {...register("role", { required: "Role is required" })}
            error={errors.role}
          />
        </div>

        <FormField
          label="Status"
          name="status"
          type="select"
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
          {...register("status", { required: "Status is required" })}
          error={errors.status}
        />

        <button
          type="submit"
          disabled={loading}
          className="px-10 ml-auto block mt-10 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
        >
          {loading ? "Loading..." : initialData ? "Update User" : "Add User"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
