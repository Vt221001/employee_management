import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaProjectDiagram,
  FaTasks,
  FaChartPie,
  FaDollarSign,
  FaCog,
  FaClock,
  FaPhone,
  FaUserClock,
  FaBullhorn,
  FaChartLine,
  FaSearch,
  FaBell,
} from "react-icons/fa";
import { Bar, Line, Doughnut, Radar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    projectCount: 0,
    userCount: 0,
    taskCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/dashboard-data`
        );
        console.log("Dashboard Data:", response.data);
        if (response.data.success) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const userData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Users",
        data: [50, 100, 150, 200, 250, 300],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const projectData = {
    labels: ["Completed", "In Progress", "On Hold"],
    datasets: [
      {
        label: "Projects",
        data: [10, 15, 5],
        backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
      },
    ],
  };

  const workingHoursData = {
    labels: ["Employee A", "Employee B", "Employee C", "Employee D"],
    datasets: [
      {
        label: "Working Hours",
        data: [35, 40, 25, 30],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const leadsData = {
    labels: ["Call Leads", "Follow-up", "Closed"],
    datasets: [
      {
        label: "Leads Status",
        data: [30, 20, 15],
        backgroundColor: ["#36a2eb", "#ffcd56", "#ff6384"],
      },
    ],
  };

  const productivityData = {
    labels: ["Employee A", "Employee B", "Employee C", "Employee D"],
    datasets: [
      {
        label: "Productivity Score",
        data: [80, 90, 75, 85],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const revenueData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Revenue",
        data: [15000, 20000, 25000, 30000],
        backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56"],
      },
    ],
  };

  const [notifications, setNotifications] = useState([
    "New user registered",
    "Project XYZ is overdue",
    "Employee A completed task ABC",
    "System maintenance scheduled for tomorrow",
    "New lead added to the CRM",
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-10">
      {/* {showNotifications && (
        <div className="absolute right-10 top-20 w-80 bg-white p-6 rounded-lg shadow-lg z-50">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Notifications</h3>
          <ul className="space-y-4">
            {notifications.map((notification, index) => (
              <li key={index} className="p-3 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition duration-200">
                {notification}
              </li>
            ))}
          </ul>
        </div>
      )} */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Users Card */}
        <div className="bg-white p-8 rounded-xl shadow-lg transform transition hover:scale-105 hover:shadow-2xl cursor-pointer">
          <div className="flex items-center mb-6">
            <FaUsers className="text-5xl text-pink-500 mr-6" />
            <h2 className="text-3xl font-bold">Users</h2>
          </div>
          <p className="text-gray-700">
            Manage user accounts, roles, and permissions.
          </p>
          <p className="mt-4 text-gray-900 font-semibold">
            Total Users: {dashboardData.userCount}
          </p>
        </div>

        {/* Projects Card */}
        <div className="bg-white p-8 rounded-xl shadow-lg transform transition hover:scale-105 hover:shadow-2xl cursor-pointer">
          <div className="flex items-center mb-6">
            <FaProjectDiagram className="text-5xl text-purple-500 mr-6" />
            <h2 className="text-3xl font-bold">Projects</h2>
          </div>
          <p className="text-gray-700">
            View, create, and manage ongoing projects.
          </p>
          <p className="mt-4 text-gray-900 font-semibold">
            Ongoing Projects: {dashboardData.projectCount}
          </p>
        </div>

        {/* Tasks Card */}
        <div className="bg-white p-8 rounded-xl shadow-lg transform transition hover:scale-105 hover:shadow-2xl cursor-pointer">
          <div className="flex items-center mb-6">
            <FaTasks className="text-5xl text-green-500 mr-6" />
            <h2 className="text-3xl font-bold">Tasks</h2>
          </div>
          <p className="text-gray-700">
            Assign tasks, track progress, and update status.
          </p>
          <p className="mt-4 text-gray-900 font-semibold">
            Pending Tasks: {dashboardData.taskCount}
          </p>
        </div>

        {/* Working Hours Card */}
        <div className="bg-white p-8 rounded-xl shadow-lg transform transition hover:scale-105 hover:shadow-2xl cursor-pointer">
          <div className="flex items-center mb-6">
            <FaUserClock className="text-5xl text-blue-500 mr-6" />
            <h2 className="text-3xl font-bold">Working Hours</h2>
          </div>
          <p className="text-gray-700">
            Monitor employee working hours and productivity.
          </p>
          <p className="mt-4 text-gray-900 font-semibold">
            Average Hours: 35/week
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* User Growth Chart */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">User Growth</h3>
          <div className="relative h-64">
            <Line data={userData} options={{ maintainAspectRatio: true }} />
          </div>
        </div>

        {/* Project Status Chart */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Project Status Overview
          </h3>
          <div className="relative h-64">
            <Bar data={projectData} options={{ maintainAspectRatio: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
