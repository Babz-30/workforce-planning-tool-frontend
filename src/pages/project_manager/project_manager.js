import { useState, useEffect } from "react";
import "./project_manager.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Home, CheckCircle } from "lucide-react";

import UserProfile from "../../components/profile/profile";
import HomeTab from "../../components/pm_home/home"; // ✅ adjust path if needed
import ProjectApprovalsManager from "../../components/pm_approvals/approval"; // ✅ adjust path if needed
import { GetProjectByCreator } from "../../services/project/getprojects";
import { GetAllAplliedApplication } from "../../services/application/GetApplicationAPI";
import { getAllEmployee } from "../../services/employee/employeeApi";

export default function ProjectTable() {
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await GetProjectByCreator();
        setProjects(res);
        setApplications(await GetAllAplliedApplication());
        await getAllEmployee().then((response) => {
          setEmployees(response.data);
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  if (loading) {
    return (
      <div className="pm-home">
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pm-home">
        <div className="alert alert-danger mt-5" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-manager-page">
      <div className="app-header">
        <div className="app-header-content">
          <h1 className="app-title">Project Management</h1>
          <p className="app-subtitle">Manage and track all active projects</p>
        </div>
        <div className="app-header-actions">
          <UserProfile />
        </div>
      </div>

      <div className="nav-container">
        <div className="nav-tabs">
          {[
            { id: "home", label: "Home", icon: Home },
            // { id: "staffing", label: "Staffing", icon: Users },
            { id: "approvals", label: "Approvals", icon: CheckCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab ${
                activeTab === tab.id ? "nav-tab-active" : ""
              }`}
            >
              <tab.icon className="nav-tab-icon" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container">
        {activeTab === "home" && <HomeTab allProjects={projects} />}

        {/* optional placeholders so the UI doesn't look broken if you stay on-page */}
        {activeTab === "approvals" && (
          <ProjectApprovalsManager
            allProjectsData={projects}
            allApplicationData={applications}
            employees={employees}
          />
        )}
      </div>
    </div>
  );
}
