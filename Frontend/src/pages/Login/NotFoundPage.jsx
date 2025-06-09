import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center bg-gray-300 justify-center h-screen text-center">
      <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="text-lg mt-2">
        Oops! The page you are looking for does not exist.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFoundPage;
