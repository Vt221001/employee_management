import React from "react";
import { Outlet } from "react-router-dom"; // Assuming you're using react-router-dom
import LeftNavbar from "../Navbar/LeftNavbar";
import TopNavbar from "../Navbar/TopNavbar";
import navigation from "../Navbar/NavbarNavigation";
import { useAuth } from "../../context/AuthProvider";

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  // const role = "Admin"; // Replace with your logic to get the role
  const { userRole } = useAuth();

  return (
    <div className="h-screen bg-[#faeedb] flex overflow-hidden ">
      {/* Left Navbar */}
      <LeftNavbar
        navigation={navigation}
        role={userRole}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed} // Pass the setter function for isCollapsed
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300`}
        style={{
          marginLeft: isCollapsed ? "64px" : "256px",
          width: `calc(100% - ${isCollapsed ? "70px" : "256px"})`,
        }}
      >
        <TopNavbar isCollapsed={isCollapsed} />
        <div className="flex-1 overflow-y-auto mt-2 mx-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
