import { useState, useEffect } from "react"
import "./DepartmentResources.css"
import { Calendar, User, Mail, MapPin, Clock } from "lucide-react"
import { getDepartmentResources } from "../../services/department/departmentDashboardApi"
import { toast } from "react-toastify"

export default function DepartmentResources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      setLoading(true)

      const response = await getDepartmentResources()
      setResources(response.data)

    } catch (error) {
      console.error("Error fetching resources:", error)
      toast.error("Failed to load department resources. Please try again.", {
        autoClose: 3000,
        position: "top-right",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  if (loading) {
    return (
      <div className="dept-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading department resources...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dept-container">
      <div className="dept-header">
        <h2 style={{ color: "#1e3a8a", fontSize: "26px" }} className="dept-title">
          Department Resources
        </h2>
        <p className="dept-subtitle">View employee assignments and project details</p>
      </div>

      {resources.length === 0 ? (
        <div className="no-results">
          <p className="no-results-text">No active project assignments found in your department.</p>
        </div>
      ) : (
        <div className="resources-grid">
          {resources.map((resource) => (
            <div key={resource.id} className="resource-card">
              <div className="resource-header">
                <div className="employee-header-info">
                  <div className="employee-avatar-small">
                    <User size={20} color="#3b82f6" />
                  </div>
                  <div>
                    <h3 className="resource-name">{resource.employeeName} (EmpId: {resource.id})</h3>
                    <p className="resource-role">{resource.role}</p>
                  </div>
                </div>
                <span className="status-badge-small status-active">{resource.projectStatus}</span>
              </div>

              <div className="employee-details-section">
                <div className="employee-detail">
                  <Mail size={14} />
                  <span>{resource.employeeEmail}</span>
                </div>
                <div className="employee-detail">
                  <MapPin size={14} />
                  <span>{resource.location}</span>
                </div>
                <div className="employee-detail">
                  <Clock size={14} />
                  <span>{resource.capacity} hours/week</span>
                </div>
              </div>

              <div className="skills-section">
                <span className="skills-label">Employee Skills</span>
                <div className="skills-chips">
                  {resource.employeeSkills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="skill-chip employee-skill-chip">
                      {skill}
                    </span>
                  ))}
                  {resource.employeeSkills.length > 4 && (
                    <span className="skill-chip-more">+{resource.employeeSkills.length - 4}</span>
                  )}
                </div>
              </div>

              <div className="project-details-section">
                <div className="project-info">
                  <span className="project-label">Assigned Project</span>
                  <h4 className="project-name-large">{resource.projectDescription} (ProjId: {resource.projectName})</h4>
                  {resource.taskDescription && (
                    <p className="request-project-desc" style={{ marginTop: "8px", fontStyle: "italic" }}>
                      Task: {resource.taskDescription}
                    </p>
                  )}
                </div>

                <div className="project-metadata-grid">
                  <div className="project-detail-item">
                    <span className="detail-label">
                      <Calendar size={14} />
                      PROJECT TIMELINE
                    </span>
                    <span className="detail-value">
                      {formatDate(resource.startDate)} → {formatDate(resource.endDate)}
                    </span>
                  </div>

                  <div className="project-detail-item">
                    <span className="detail-label">
                      <User size={14} />
                      TEAM SIZE
                    </span>
                    <span className="detail-value">{resource.teamSize} members</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}