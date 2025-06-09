import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const RoleBasedAccess = ({ allowedRoles, children }) => {
  const { userRole, accessToken } = useAuth();

  console.log("role", userRole, "accessToken", accessToken);

  if (!accessToken) {
    return <Navigate to="/" />;
  }

  if (allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  return <div>You do not have permission to view this content.</div>;
};

export default RoleBasedAccess;
