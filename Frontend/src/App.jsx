import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/CombineLayout/Layout.jsx";
import LoginPage from "./pages/Login/LoginPage.jsx";
import ViewTeamMembers from "./pages/Team/ViewTeamMembers.jsx";
import AddTeamPage from "./pages/Team/AddTeamPage.jsx";
import RoleBasedAccess from "./RoleBase/RoleBaseAccess.jsx";
import ProjectTable from "./pages/Project/ProjectTable.jsx";
import AddProject from "./pages/Project/AddProject.jsx";
import AssingProject from "./pages/Project/AssingProject.jsx";
import AssignTask from "./pages/Task/AssignTask.jsx";
import ViewTasks from "./pages/Task/ViewTasks.jsx";
import AdminDashboard from "./pages/Dashboard/AdminDashboard.jsx";
import "react-toastify/dist/ReactToastify.css";
import UserProfile from "./pages/Team/UserProfile.jsx";
import NotFoundPage from "./pages/Login/NotFoundPage.jsx";

const App = () => {
  const authToken = true;

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/management"
        element={authToken ? <Layout /> : <Navigate to="/" />}
      >
        <Route
          path="add-team"
          element={
            <RoleBasedAccess allowedRoles={["Admin", "ProjectManager"]}>
              <AddTeamPage />
            </RoleBasedAccess>
          }
        />
        <Route
          path="view-team"
          element={
            <RoleBasedAccess allowedRoles={["Admin", "ProjectManager"]}>
              <ViewTeamMembers />{" "}
            </RoleBasedAccess>
          }
        />
        <Route
          path="view-projects"
          element={
            <RoleBasedAccess allowedRoles={["Admin", "ProjectManager"]}>
              <ProjectTable />{" "}
            </RoleBasedAccess>
          }
        />
        <Route
          path="add-projects"
          element={
            <RoleBasedAccess allowedRoles={["Admin", "ProjectManager"]}>
              <AddProject />{" "}
            </RoleBasedAccess>
          }
        />
        <Route
          path="assign-projects"
          element={
            <RoleBasedAccess allowedRoles={["Admin", "ProjectManager"]}>
              <AssingProject />{" "}
            </RoleBasedAccess>
          }
        />
        <Route
          path="assign-task"
          element={
            <RoleBasedAccess allowedRoles={["Admin", "ProjectManager"]}>
              <AssignTask />{" "}
            </RoleBasedAccess>
          }
        />
        <Route
          path="view-tasks"
          element={
            <RoleBasedAccess
              allowedRoles={["Admin", "ProjectManager", "TeamMember"]}
            >
              <ViewTasks />{" "}
            </RoleBasedAccess>
          }
        />
        <Route
          path="user-profile/:id"
          element={
            <RoleBasedAccess allowedRoles={["Admin", "TeamMember"]}>
              <UserProfile />{" "}
            </RoleBasedAccess>
          }
        />
        <Route
          path="dashboard"
          element={
            <RoleBasedAccess allowedRoles={["Admin", "ProjectManager"]}>
              <AdminDashboard />{" "}
            </RoleBasedAccess>
          }
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
