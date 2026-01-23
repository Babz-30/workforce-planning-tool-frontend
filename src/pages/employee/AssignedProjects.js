import { useState, useEffect } from "react"
import "./AssignedProjects.css"
import { Calendar, MapPin, Users, Briefcase } from "lucide-react"
import { getAssignedProjects } from "../../services/employee/assignedProjectAPI"

export default function AssignedProjects() {
  const [assignedProjects, setAssignedProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const allowedStatuses = ["ACTIVE", "COMPLETED", "APPLIED", "REQUEST_DH_APPROVAL", "REJECTED_BY_PM", "REJECTED_BY_DH", "PROJECT_COMPLETED"]

  const profileData = JSON.parse(localStorage.getItem("loginResponse"))
  const employeeId = profileData?.employeeId

  useEffect(() => {
    fetchAssignedProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAssignedProjects = async () => {
    try {
      setLoading(true)

      if (!employeeId) {
        setError("Employee ID not found")
        setLoading(false)
        return
      }

      const response = await getAssignedProjects(employeeId)

      // Process the response data
      const processedProjects = response.map((item) => processProjectData(item))

      const filteredProjects = processedProjects.filter((project) => allowedStatuses.includes(project.status))

      setAssignedProjects(filteredProjects)
      setLoading(false)
      setError(null)
    } catch (err) {
      console.error("Error fetching assigned projects:", err)
      setError("Failed to load assigned projects")
      setLoading(false)
    }
  }

  const processProjectData = (item) => {
    const { application, project } = item

    // Determine status based on business rules
    let finalStatus = application.currentStatus
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const projectEndDate = new Date(project.projectEnd)
    projectEndDate.setHours(0, 0, 0, 0)

    if (application.currentStatus === "COMPLETED" && projectEndDate < today) {
      finalStatus = "COMPLETED"
    } else if (application.currentStatus === "COMPLETED" && projectEndDate >= today) {
      finalStatus = "ACTIVE"
    }

    // Determine username based on status
    let assignedByUsername = "System"
    switch (application.currentStatus) {
      case "SUGGESTED":
        assignedByUsername =  application.suggestedBy?.username || "System"
        break
      case "ASSIGNED":
        assignedByUsername = `${application.initiatedBy.username} (${application.initiatedBy.role})` || "System"
        break
      case "REQUEST_DH_APPROVAL":
        assignedByUsername = `${application.approvedByProjectManager.username} (${application.approvedByProjectManager.role})` || "System"
        break
      case "COMPLETED":
        assignedByUsername = `${application.approvedByDepartmentHead.username} (${application.approvedByDepartmentHead.role})` || "System"
        break
      case "REJECTED":
        assignedByUsername = application.rejectedBy?.username || "System"
        break
      default:
        assignedByUsername = application.initiatedBy?.username || "System"
    }

    // Get skills for the specific project role
    const roleData = project.roles?.find((role) => role.requiredRole === application.projectRole)
    const skills = roleData?.requiredCompetencies?.filter((skill) => skill) || null

    const roleCapacity = roleData?.capacity || application.approvedCapacity || application.requestedCapacity

    return {
      id: application.id,
      description: project.projectDescription,
      taskDescription: project.taskDescription,
      startDate: project.projectStart,
      endDate: project.projectEnd,
      requiredEmployees: project.requiredEmployees,
      role: application.projectRole,
      competencies: skills,
      capacity: roleCapacity, // Use roleCapacity instead of application capacity
      location: project.selectedLocations?.join(", ") || "Not specified",
      assignedBy: assignedByUsername,
      assignedDate: application.timestamps?.assignedAt || application.timestamps?.appliedAt,
      status: finalStatus,
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getStatusClass = (status) => {
    if (!status) return "status-active"
    const statusUpper = status.toUpperCase()
    if (statusUpper === "COMPLETED" || statusUpper === "PROJECT_COMPLETED") return "status-completed"
    if (statusUpper === "ACTIVE") return "status-active"
    if (statusUpper === "APPLIED" || statusUpper === "REQUEST_DH_APPROVAL") return "status-applied"
    if (statusUpper === "REJECTED_BY_PM" || statusUpper === "REJECTED_BY_DH") return "status-rejected"
    return "status-active"
  }

  const getStatusPriority = (status) => {
    const priorities = {
      'ACTIVE': 1,
      'COMPLETED': 2,
      'APPLIED': 3,
      'REQUEST_DH_APPROVAL': 3,
      'REJECTED_BY_PM': 4,
      'REJECTED_BY_DH': 4
    }
    return priorities[status] || 5
  }

  if (loading) {
    return (
      <div className="employee-container">
        <div className="employee-header">
          <h2 style={{ color: "#1e3a8a", fontSize: "26px" }} className="employee-title">
            Assigned Projects
          </h2>
          <p className="employee-subtitle">Track your current project assignments</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your projects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="employee-container">
        <div className="employee-header">
          <h2 style={{ color: "#1e3a8a", fontSize: "26px" }} className="employee-title">
            Assigned Projects
          </h2>
          <p className="employee-subtitle">Track your current project assignments</p>
        </div>
        <div className="error-container">
          <p className="error-text">⚠️ {error}</p>
        </div>
      </div>
    )
  }

  if (assignedProjects.length === 0) {
    return (
      <div className="employee-container">
        <div className="employee-header">
          <h2 style={{ color: "#1e3a8a", fontSize: "26px" }} className="employee-title">
            Assigned Projects
          </h2>
          <p className="employee-subtitle">Track your current project assignments</p>
        </div>
        <div className="no-projects-container">
          <div className="no-projects-icon">📋</div>
          <h3 className="no-projects-title">No Projects Assigned</h3>
          <p className="no-projects-text">You don't have any projects assigned yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="employee-container">
      <div className="employee-header">
        <h2 style={{ color: "#1e3a8a", fontSize: "26px" }} className="employee-title">
          Assigned Projects
        </h2>
        <p className="employee-subtitle">Track your current project assignments</p>
      </div>

      <div className="assigned-container">
        {assignedProjects.sort((a, b) => getStatusPriority(a.status) - getStatusPriority(b.status)).map((project) => (
          <div key={project.id} className="assigned-card">
            <div className="assigned-header">
              <div className="assigned-title-section">
                <h3 className="assigned-title">{project.description}</h3>
                <p className="assigned-description">{project.taskDescription}</p>
                <p className="assigned-meta">
                  Assigned by: <strong>{project.assignedBy || "System"}</strong>
                  {project.assignedDate && (
                    <>
                      {" "}
                      • Assigned on: <strong>{formatDate(project.assignedDate)}</strong>
                    </>
                  )}
                </p>
              </div>
              <div className="assigned-badges">
                <span className={`status-badge ${getStatusClass(project.status)}`}>{project.status || "ACTIVE"}</span>
              </div>
            </div>

            <div className="project-details-grid">
              <div className="detail-item">
                <span className="detail-label">
                  <MapPin size={14} style={{ display: "inline", marginRight: "4px" }} />
                  LOCATION
                </span>
                <span className="detail-value-large">{project.location || "Not specified"}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  <Users size={14} style={{ display: "inline", marginRight: "4px" }} />
                  TEAM SIZE
                </span>
                <span className="detail-value-large">
                  {project.requiredEmployees || 0} {project.requiredEmployees === 1 ? "Member" : "Members"}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  <Briefcase size={14} style={{ display: "inline", marginRight: "4px" }} />
                  CAPACITY
                </span>
                <span className="detail-value-large">{project.capacity || 40} hours/week</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  <Calendar size={14} style={{ display: "inline", marginRight: "4px" }} />
                  TIMELINE
                </span>

                <span className="detail-value-large">
                  {formatDate(project.startDate)} → {formatDate(project.endDate)}
                </span>
              </div>

              {project.role && (
                <div className="detail-item">
                  <span className="detail-label">PROJECT ROLE</span>
                  <div className="roles-chips-container">
                    <span className="role-chip">{project.role}</span>
                  </div>
                </div>
              )}

              {project.competencies && project.competencies.length > 0 && (
                <div className="detail-item">
                  <span className="detail-label">REQUIRED SKILLS</span>
                  <div className="competencies-chips-container">
                    {project.competencies.map((skill, index) => (
                      <span key={index} className="competency-chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
