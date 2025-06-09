import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMoon, FiSun } from "react-icons/fi";
import { CgNotes } from "react-icons/cg";
import { useDarkMode } from "../../context/DarkModeContext";
import io from "socket.io-client";
import { MdNotifications } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsCalendar } from "react-icons/bs";

const socket = io("http://localhost:8080");

const TopNavbar = ({ isCollapsed, setIsCollapsed }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    console.log("👤 User Data:", user);

    if (user && user.id) {
      console.log("🛠 Joining room:", user.id);
      socket.emit("joinRoom", user.id);

      socket.on("newTask", (newNotification) => {
        console.log("🔔 Notification received in Frontend:", newNotification);
        setNotifications((prev) => [...prev, newNotification]);
      });

      return () => {
        socket.off("notification");
      };
    }
  }, [user]);

  // ✅ Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setIsNotifOpen(false);
        setIsProfileOpen(false);
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="dark:bg-gray-900 bg-gradient-to-tl from-orange-200 to-indigo-200 dark:border-[#552d44] dark:border-2 mx-3 my-2 text-white py-2 shadow-sm">
      <div className="mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl dark:text-pink-600 flex justify-center items-center gap-2 text-purple-600 font-bold">
          <CgNotes />
          Auto Productivity Management
        </h1>

        <div className="flex dark:text-gray-200 text-gray-800 items-center gap-4">
          {/* ✅ Notification Button */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsProfileOpen(false);
              }}
            >
              <MdNotifications size={24} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* ✅ Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 shadow-lg rounded-md z-50 border border-gray-300 dark:border-gray-700">
                <ul className="p-2">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notif, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          navigate(`/tasks/${notif.taskId}`);
                          setIsNotifOpen(false);
                        }}
                        className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-b last:border-0 cursor-pointer"
                      >
                        {notif.message}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-sm text-gray-500">
                      No new notifications
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* ✅ Profile Dropdown */}
          <div
            className="flex text-right items-center gap-1 relative"
            ref={profileRef}
          >
            <div className="hidden sm:flex border-r border-gray-600 pr-2 flex-col text-sm">
              {user ? (
                <>
                  <span className="font-semibold text-md">{user.name}</span>
                  <span className="text-gray-400 text-xs">{user.email}</span>
                </>
              ) : (
                <span className="text-gray-400 text-xs">Guest</span>
              )}
            </div>

            <img
              src={
                user?.profileImage ||
                "https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_0.jpg"
              }
              alt="Profile"
              className="w-11 h-11 rounded-full object-cover cursor-pointer"
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotifOpen(false);
              }}
            />

            {/* ✅ Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 shadow-lg rounded-md z-50 border border-gray-300 dark:border-gray-700">
                <ul>
                  <li>
                    <button
                      onClick={() => {
                        navigate(`/management/user-profile/${user.id}`);
                        setIsProfileOpen(false);
                      }}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* ✅ Calendar Button */}
          <div className="relative" ref={calendarRef}>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <BsCalendar size={24} />
            </button>

            {isCalendarOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 p-2 shadow-lg rounded-md z-50 border border-gray-300 dark:border-gray-700">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  inline
                />
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              toggleDarkMode();
              localStorage.setItem("darkMode", !isDarkMode);
            }}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
          >
            {isDarkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
