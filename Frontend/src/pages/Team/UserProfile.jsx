import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/single-user/${id}`
        );
        setUser(response.data.data);
        setEditedUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Error fetching user data!");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  // User Update API
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/update-user/${id}`,
        editedUser
      );
      setUser(response.data.data);
      setIsEditing(false);
      toast.success("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user data!");
    }
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center text-lg font-semibold">User not found</div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <div className="w-2xl p-6 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-xl shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <img
            src={user.photo}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-gray-200 mb-4"
          />
          {isEditing ? (
            <div className="w-full space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, name: e.target.value })
                  }
                  className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, email: e.target.value })
                  }
                  className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-600">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editedUser.phone}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, phone: e.target.value })
                  }
                  className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                onClick={handleSave}
                className="w-full py-3 mt-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-lg text-gray-500">{user.email}</p>
              <p className="text-lg font-medium text-gray-700">
                Role: {user.role}
              </p>
              <p className="text-lg text-gray-700">Phone: {user.phone}</p>
              <p
                className={`text-lg ${
                  user.status === "active" ? "text-green-600" : "text-red-600"
                }`}
              >
                Status: {user.status}
              </p>
              <button
                onClick={handleEdit}
                className="w-full py-3 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
