import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "ved@gmail.com",
    password: "123456",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user-login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { accessToken, refreshToken, user } = res.data.data;
      login(accessToken, refreshToken);

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("There was an error logging in!", error);
      toast.error(error.response?.data?.message || "Invalid credentials", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="my-5 h-screen flex flex-col md:flex-row">
      {/* Left Column */}
      <div className="md:w-1/2 mb-5 p-8 flex flex-col justify-center items-center md:items-start space-y-4 px-32">
        <div className="flex flex-col items-center md:items-start">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
            className="w-48 mb-4"
            alt="logo"
          />
          <h4 className="text-lg font-semibold">
            We are The MadQuick Tech Team
          </h4>
        </div>

        <p className="text-center md:text-left mt-4 mb-6">
          Please login to your account
        </p>

        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded w-full"
            placeholder="Email address"
            type="email"
            required
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded w-full"
            placeholder="Password"
            type="password"
            required
          />
          <div className="w-full text-center md:text-left pt-5">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 via-red-600 to-pink-600 text-white py-3 rounded mb-4"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>

      {/* Right Column */}
      <div className="md:w-1/2 mb-5 flex flex-col justify-center bg-gradient-to-r mx-8 from-orange-500 via-red-600 to-pink-600 rounded-r-md p-5 text-white">
        <div className="px-3 py-4 mx-md-4">
          <h4 className="mb-4 text-xl">We are more than just a company</h4>
          <p className="text-lg mb-0">
            At MadQuick Tech, we believe in harnessing technology to transform
            ideas into reality. Our dedicated team works tirelessly to provide
            innovative solutions that drive success for our clients. Whether
            you're looking for software development, IT consulting, or digital
            transformation services, we've got you covered. Join us as we pave
            the way for a smarter future, together .
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LoginPage;
