import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import ProjectTable from "./pages/project_manager/project_manager";
import CreateProject from "./pages/project/CreateProject";
import EditProject from "./pages/edit_project/editproject";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateEmployee from "./pages/employee/UpdateEmployee";
import PrivateRoute from "./helper/PrivateRoute";
import ResourcePlanner from "./pages/resource_planner/resourcePlanner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/project_manager" element={<ProjectTable />} />
        <Route
          path="/project_manager/create-project"
          element={<CreateProject />}
        />
        <Route
          path="/project_manager/edit-project/:projectId"
          element={<EditProject />}
        />
        <Route
          path="/update-employee"
          element={
            <PrivateRoute>
              <UpdateEmployee />
            </PrivateRoute>
          }
        />
        <Route
          path="/resource-planner"
          element={
            <PrivateRoute>
              <ResourcePlanner />
            </PrivateRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </Router>
  );
}

export default App;
