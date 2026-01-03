"use client"

import { useState, useEffect } from "react"
import "./ProjectRequests.css"
import { Calendar, User, Briefcase, Check, X, Clock } from "lucide-react"
import { toast } from "react-toastify"
// import axios from 'axios';

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

      // TODO: Replace with actual API call
      // const response = await axios.get('/api/department/project-requests');
      // setRequests(response.data);

      // Mock data
      const mockRequests = [
        {
          id: 1,
          employeeName: "John Smith",
          employeeRole: "Senior Developer",
          employeeSkills: ["React", "Node.js", "Python", "AWS", "Docker"],
          projectName: "Mobile Banking App",
          projectDescription: "Develop a mobile banking application with biometric authentication",
          requestedBy: "Alice Martinez",
          requestedDate: "2024-12-20",
          projectStartDate: "2025-01-05",
          projectEndDate: "2025-04-30",
          requiredSkills: ["React Native", "Node.js", "Security"],
          location: "San Francisco, CA",
          teamSize: 5,
          requiredRoles: ["Frontend Developer", "Backend Developer", "Security Specialist"],
          estimatedWorkload: 40,
          status: "pending",
        },
        {
          id: 2,
          employeeName: "Sarah Johnson",
          employeeRole: "UI/UX Designer",
          employeeSkills: ["Figma", "Adobe XD", "Sketch", "User Research"],
          projectName: "E-Commerce Platform Redesign",
          projectDescription: "Complete UI/UX overhaul of existing e-commerce platform",
          requestedBy: "Bob Thompson",
          requestedDate: "2024-12-19",
          projectStartDate: "2025-01-10",
          projectEndDate: "2025-03-15",
          requiredSkills: ["Figma", "User Research", "Prototyping"],
          location: "New York, NY",
          teamSize: 3,
          requiredRoles: ["UI Designer", "UX Researcher"],
          estimatedWorkload: 35,
          status: "pending",
        },
        {
          id: 3,
          employeeName: "Mike Chen",
          employeeRole: "Backend Developer",
          employeeSkills: ["Java", "Spring Boot", "PostgreSQL", "Kubernetes"],
          projectName: "Microservices Migration",
          projectDescription: "Migrate monolithic application to microservices architecture",
          requestedBy: "Carol Davis",
          requestedDate: "2024-12-18",
          projectStartDate: "2025-01-15",
          projectEndDate: "2025-06-30",
          requiredSkills: ["Java", "Spring Boot", "Kubernetes", "Docker"],
          location: "Austin, TX",
          teamSize: 8,
          requiredRoles: ["Backend Developer", "DevOps Engineer", "Solution Architect"],
          estimatedWorkload: 45,
          status: "approved",
        },
        {
          id: 4,
          employeeName: "Emma Davis",
          employeeRole: "Full Stack Developer",
          employeeSkills: ["React", "Python", "Django", "PostgreSQL"],
          projectName: "Customer Portal Development",
          projectDescription: "Build a new customer self-service portal",
          requestedBy: "David Wilson",
          requestedDate: "2024-12-17",
          projectStartDate: "2025-02-01",
          projectEndDate: "2025-05-20",
          requiredSkills: ["React", "Python", "Django"],
          location: "Remote",
          teamSize: 4,
          requiredRoles: ["Full Stack Developer", "QA Engineer"],
          estimatedWorkload: 38,
          status: "rejected",
        },
        {
          id: 5,
          employeeName: "David Wilson",
          employeeRole: "DevOps Engineer",
          employeeSkills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins"],
          projectName: "CI/CD Pipeline Setup",
          projectDescription: "Implement automated CI/CD pipeline for deployment",
          requestedBy: "Emma Rodriguez",
          requestedDate: "2024-12-21",
          projectStartDate: "2025-01-08",
          projectEndDate: "2025-03-30",
          requiredSkills: ["Jenkins", "Docker", "AWS", "Terraform"],
          location: "Seattle, WA",
          teamSize: 2,
          requiredRoles: ["DevOps Engineer"],
          estimatedWorkload: 30,
          status: "pending",
        },
      ]

      setTimeout(() => {
        setRequests(mockRequests)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error("Error fetching requests:", error)
      setLoading(false)
    }
  }

  const handleApprove = async (requestId) => {
    try {
      // TODO: Replace with actual API call
      // await axios.post(`/api/department/project-requests/${requestId}/approve`);

      setRequests(requests.map((req) => (req.id === requestId ? { ...req, status: "approved" } : req)))

      toast.success("Request approved successfully!", {
        position: "top-right",
        autoClose: 3000,
      })
    } catch (error) {
      console.error("Error approving request:", error)
      toast.error("Failed to approve request", {
        position: "top-right",
        autoClose: 3000,
      })
    }
  }

  const handleReject = async (requestId) => {
    try {
      // TODO: Replace with actual API call
      // await axios.post(`/api/department/project-requests/${requestId}/reject`);

      setRequests(requests.map((req) => (req.id === requestId ? { ...req, status: "rejected" } : req)))

      toast.success("Request rejected", {
        position: "top-right",
        autoClose: 3000,
      })
    } catch (error) {
      console.error("Error rejecting request:", error)
      toast.error("Failed to reject request", {
        position: "top-right",
        autoClose: 3000,
      })
    }
  }

  const formatDate = (dateString) => {
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
    (a, b) => new Date(a.requestedDate) - new Date(b.requestedDate),
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
                    <h3 className="request-employee-name">{request.employeeName}</h3>
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
                  <h4 className="request-project-name">{request.projectName}</h4>
                  <p className="request-project-desc">{request.projectDescription}</p>
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
                    <span className="detail-value">{request.requestedBy}</span>
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
                    {request.requiredSkills.map((skill, index) => (
                      <span key={index} className="skill-chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="request-skills">
                  <span className="detail-label">Required Roles</span>
                  <div className="skills-chips">
                    {request.requiredRoles.map((role, index) => (
                      <span key={index} className="skill-chip">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="request-skills">
                  <span className="detail-label">Employee Skills</span>
                  <div className="skills-chips">
                    {request.employeeSkills.map((skill, index) => (
                      <span key={index} className="skill-chip employee-skill-chip">
                        {skill}
                      </span>
                    ))}
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
