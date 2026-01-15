"use client"

import { useState, useEffect } from "react"
import "./ProjectRequests.css"
import { Calendar, User, Briefcase, Check, X, Clock } from "lucide-react"
import { toast } from "react-toastify"
import { getDepartmentProjectRequests, approveProjectRequest, rejectProjectRequest } from "../../services/department/departmentDashboardApi"

export default function ProjectRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("pending") // pending, approved, rejected, all

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)

      const response = await getDepartmentProjectRequests()
      setRequests(response.data)

    } catch (error) {
      console.error("Error fetching requests:", error)
      toast.error("Failed to load project requests. Please try again.", {
        autoClose: 3000,
        position: "top-right",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (applicationId) => {
    try {
      await approveProjectRequest(applicationId, "Approved by Department Head")

      // Update local state
      setRequests(requests.map((req) => 
        req.id === applicationId ? { ...req, status: "approved" } : req
      ))

      toast.success("Request approved successfully!", {
        position: "top-right",
        autoClose: 3000,
      })

      // Optionally refresh the data
      // await fetchRequests()

    } catch (error) {
      console.error("Error approving request:", error)
      toast.error("Failed to approve request. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      })
    }
  }

  const handleReject = async (applicationId) => {
    try {
      await rejectProjectRequest(applicationId, "Rejected by Department Head")

      // Update local state
      setRequests(requests.map((req) => 
        req.id === applicationId ? { ...req, status: "rejected" } : req
      ))

      toast.success("Request rejected", {
        position: "top-right",
        autoClose: 3000,
      })

      // Optionally refresh the data
      // await fetchRequests()

    } catch (error) {
      console.error("Error rejecting request:", error)
      toast.error("Failed to reject request. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      })
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: "status-pending", label: "Pending", icon: <Clock size={14} /> },
      approved: { class: "status-approved", label: "Approved", icon: <Check size={14} /> },
      rejected: { class: "status-rejected", label: "Rejected", icon: <X size={14} /> },
    }
    return badges[status] || badges.pending
  }

  const filteredRequests = (filter === "all" ? requests : requests.filter((req) => req.status === filter)).sort(
    (a, b) => new Date(b.requestedDate) - new Date(a.requestedDate),
  )

  if (loading) {
    return (
      <div className="dept-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dept-container">
      <div className="dept-header">
        <h2 style={{ color: "#1e3a8a", fontSize: "26px" }} className="dept-title">
          Project Requests
        </h2>
        <p className="dept-subtitle">Review and approve employee participation in projects</p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button className={`filter-tab ${filter === "pending" ? "active" : ""}`} onClick={() => setFilter("pending")}>
          Pending ({requests.filter((r) => r.status === "pending").length})
        </button>
        <button className={`filter-tab ${filter === "approved" ? "active" : ""}`} onClick={() => setFilter("approved")}>
          Approved ({requests.filter((r) => r.status === "approved").length})
        </button>
        <button className={`filter-tab ${filter === "rejected" ? "active" : ""}`} onClick={() => setFilter("rejected")}>
          Rejected ({requests.filter((r) => r.status === "rejected").length})
        </button>
        <button className={`filter-tab ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
          All ({requests.length})
        </button>
      </div>

      {/* Requests List */}
      <div className="requests-container">
        {filteredRequests.map((request) => {
          const statusBadge = getStatusBadge(request.status)
          return (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <div className="request-employee-info">
                  <div className="employee-avatar-small">
                    <User size={20} color="#3b82f6" />
                  </div>
                  <div>
                    <h3 className="request-employee-name">{request.employeeName} (EmpId: {request.employeeId})</h3>
                    <p className="request-employee-role">{request.employeeRole}</p>
                  </div>
                </div>
                <span className={`status-badge ${statusBadge.class}`}>
                  {statusBadge.icon}
                  {statusBadge.label}
                </span>
              </div>

              <div className="request-body">
                <div className="request-project-info">
                  <h4 className="request-project-name">{request.projectDescription} (ProjId: {request.projectName})</h4>
                  {request.taskDescription && (
                    <p className="request-project-desc" style={{ marginTop: "8px", fontStyle: "italic" }}>
                      Task: {request.taskDescription}
                    </p>
                  )}
                </div>

                <div className="request-details-grid">
                  <div className="request-detail-item">
                    <span className="detail-label">
                      <Calendar size={14} />
                      PROJECT TIMELINE
                    </span>
                    <span className="detail-value">
                      {formatDate(request.projectStartDate)} → {formatDate(request.projectEndDate)}
                    </span>
                  </div>

                  <div className="request-detail-item">
                    <span className="detail-label">
                      <User size={14} />
                      LOCATION
                    </span>
                    <span className="detail-value">{request.location}</span>
                  </div>

                  <div className="request-detail-item">
                    <span className="detail-label">
                      <Briefcase size={14} />
                      WORKLOAD
                    </span>
                    <span className="detail-value">{request.estimatedWorkload} hours/week</span>
                  </div>

                  <div className="request-detail-item">
                    <span className="detail-label">
                      <User size={14} />
                      TEAM SIZE
                    </span>
                    <span className="detail-value">{request.teamSize} members</span>
                  </div>

                  <div className="request-detail-item">
                    <span className="detail-label">
                      <User size={14} />
                      REQUESTED BY
                    </span>
                    <span className="detail-value">{request.requestedBy} ({request.requestedByRole})</span>
                  </div>

                  <div className="request-detail-item">
                    <span className="detail-label">
                      <Clock size={14} />
                      REQUESTED ON
                    </span>
                    <span className="detail-value">{formatDate(request.requestedDate)}</span>
                  </div>
                </div>
                
                <div className="request-skills">
                  <span className="detail-label">Required Skills</span>
                  <div className="skills-chips">
                    {request.requiredSkills.slice(0, 6).map((skill, index) => (
                      <span key={index} className="skill-chip">
                        {skill}
                      </span>
                    ))}
                    {request.requiredSkills.length > 6 && (
                      <span className="skill-chip-more">+{request.requiredSkills.length - 6}</span>
                    )}
                  </div>
                </div>

                <div className="request-skills">
                  <span className="detail-label">Required Roles</span>
                  <div className="skills-chips">
                    {request.requiredRoles.slice(0, 4).map((role, index) => (
                      <span key={index} className="skill-chip">
                        {role}
                      </span>
                    ))}
                    {request.requiredRoles.length > 4 && (
                      <span className="skill-chip-more">+{request.requiredRoles.length - 4}</span>
                    )}
                  </div>
                </div>

                <div className="request-skills">
                  <span className="detail-label">Employee Skills & Interests</span>
                  <div className="skills-chips">
                    {request.employeeSkills.slice(0, 6).map((skill, index) => (
                      <span key={index} className="skill-chip employee-skill-chip">
                        {skill}
                      </span>
                    ))}
                    {request.employeeSkills.length > 6 && (
                      <span className="skill-chip-more">+{request.employeeSkills.length - 6}</span>
                    )}
                  </div>
                </div>

              </div>

              {request.status === "pending" && (
                <div className="request-actions">
                  <button className="btn-approve" onClick={() => handleApprove(request.id)}>
                    <Check size={18} />
                    Approve
                  </button>
                  <button className="btn-reject" onClick={() => handleReject(request.id)}>
                    <X size={18} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredRequests.length === 0 && (
        <div className="no-results">
          <p className="no-results-text">No {filter !== "all" ? filter : ""} requests found.</p>
        </div>
      )}
    </div>
  )
}