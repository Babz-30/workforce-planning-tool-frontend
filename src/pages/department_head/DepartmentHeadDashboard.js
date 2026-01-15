import { useState } from "react"
import "./DepartmentHeadDashboard.css"
import UserProfile from "../../components/profile/profile";
import EmployeeProfiles from "./EmployeeProfiles"
import ProjectRequests from "./ProjectRequests"
import DepartmentResources from "./DepartmentResources"

export default function DepartmentHeadDashboard() {
  const [activeTab, setActiveTab] = useState("employees")

  // Profile data
  const profileData = JSON.parse(localStorage.getItem("loginResponse"))

  return (
    <div className="dept-head-dashboard-page">
      {/* Header with Welcome Message and Logout */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="welcome-section">
            <h1 style={{ color: "#1e3a8a", fontSize: "32px" }} className="dashboard-main-title">
              Department Head Dashboard
            </h1>
            <p className="welcome-text">
              Welcome back, <strong>{profileData?.firstName || "Department Head"}</strong>
            </p>

            {/* Breadcrumb Navigation */}
            <nav className="breadcrumb-nav">
              <button
                onClick={() => setActiveTab("employees")}
                className={`breadcrumb-item ${activeTab === "employees" ? "active" : ""}`}
              >
                Employee Profiles
              </button>
              <span className="breadcrumb-separator">/</span>
              <button
                onClick={() => setActiveTab("requests")}
                className={`breadcrumb-item ${activeTab === "requests" ? "active" : ""}`}
              >
                Project Requests
              </button>
              <span className="breadcrumb-separator">/</span>
              <button
                onClick={() => setActiveTab("resources")}
                className={`breadcrumb-item ${activeTab === "resources" ? "active" : ""}`}
              >
                Department Resources
              </button>
            </nav>
          </div>
          <div className="app-header-actions">
            <UserProfile />
          </div>
        </div>
      </div>

      <main className="main-content">
        {activeTab === "employees" && <EmployeeProfiles />}
        {activeTab === "requests" && <ProjectRequests />}
        {activeTab === "resources" && <DepartmentResources />}
      </main>
    </div>
  )
}
