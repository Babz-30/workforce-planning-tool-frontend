import { useState } from "react"
import "./DepartmentHeadDashboard.css"
import { Bell, Settings, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import EmployeeProfiles from "./EmployeeProfiles"
import ProjectRequests from "./ProjectRequests"
import DepartmentResources from "./DepartmentResources"

export default function DepartmentHeadDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("employees")

  // Profile data
  const profileData = JSON.parse(localStorage.getItem("loginResponse"))

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    navigate("/", { replace: true })
    toast.success("You've been logged out", {
      autoClose: 2000,
      position: "top-right",
    })
  }

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
          <div className="header-actions">
            <button className="icon-btn" title="Notifications">
              <Bell size={20} />
            </button>
            <button
              className="icon-btn"
              title="Settings"
              onClick={() => {
                const deptHeadData = JSON.parse(localStorage.getItem("loginResponse"))
                if (deptHeadData) {
                  navigate("/update-profile", { state: { userData: deptHeadData, from: "dept-head" }, replace: true })
                } else {
                  console.error("No department head data in localStorage")
                }
              }}
            >
              <Settings size={20} />
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
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
