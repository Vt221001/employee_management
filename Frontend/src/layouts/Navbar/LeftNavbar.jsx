import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
} from "react-icons/fa";

const LeftNavbar = ({ navigation, role, isCollapsed, setIsCollapsed }) => {
  const [dropdownOpen, setDropdownOpen] = useState({});

  const handleDropdownClick = (name) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <div
      className={`bg-gradient-to-tl from-orange-200 to-indigo-200 h-screen ${
        isCollapsed ? "w-16" : "w-64"
      } transition-width duration-300 fixed`}
    >
      <div className="text-[#1f1f1f] p-4 flex justify-between items-center">
        <div>{isCollapsed ? "C" : "Collapsed Navbar"}</div>
        <button onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
      <nav className="flex flex-col p-4">
        {filteredNavigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div>
                <button
                  className={`flex items-center justify-between w-full p-2 text-left rounded-md hover:bg-[#f29f67] ${
                    isCollapsed ? "" : "mb-2"
                  }`}
                  onClick={() => handleDropdownClick(item.name)}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span className="ml-3">{item.name}</span>}
                  </div>
                  {!isCollapsed && (
                    <span>
                      {dropdownOpen[item.name] ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </span>
                  )}
                </button>
                {dropdownOpen[item.name] && !isCollapsed && (
                  <div className="ml-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.to}
                        className="block p-2 pl-6 text-gray-700 hover:bg-[#f29f67] rounded-md"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.to}
                className={`flex items-center p-2 rounded-md hover:bg-gray-200 ${
                  isCollapsed ? "" : "mb-2"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default LeftNavbar;
