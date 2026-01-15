import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Briefcase,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "./approval.css";
import {
  keepOnlyExistingProjects,
  keepPublishedProjects,
} from "../../helper/approvalBinder";

import {
  requestDhApproval,
  rejectApplication,
} from "../../services/application/pm_applicationAPI";

const ProjectApprovalsManager = ({
  allProjectsData,
  allApplicationData,
  employees,
}) => {
  console.log("All Projects Data:", allProjectsData);
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [processingApp, setProcessingApp] = useState(null);

  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);

        const projectsData = keepPublishedProjects(allProjectsData);
        const applicationsData = keepOnlyExistingProjects(
          allApplicationData,
          projectsData
        );

        setProjects(projectsData);
        setApplications(applicationsData || {}); // ✅ safety
      } catch (error) {
        console.error("Error loading data:", error);
        setApplications({}); // ✅ fallback
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [allProjectsData, allApplicationData]);

  const employeeById = employees.reduce((acc, emp) => {
    acc[emp.employeeId] = emp;
    return acc;
  }, {});

  const handleApprove = async (applicationId, projectId) => {
    setProcessingApp(applicationId);
    try {
      // Replace with your actual API call
      await requestDhApproval(applicationId);

      // Update local state
      setApplications((prev) => ({
        ...prev,
        [projectId]: prev[projectId].map((app) =>
          app.applicationId === applicationId
            ? { ...app, currentStatus: "APPROVED" }
            : app
        ),
      }));
    } catch (error) {
      console.error("Error approving application:", error);
      alert("Failed to approve application");
    } finally {
      setProcessingApp(null);
    }
  };

  const handleReject = async (applicationId, projectId) => {
    const reason = prompt("Please provide a rejection reason:");
    if (!reason) return;

    setProcessingApp(applicationId);
    try {
      // Replace with your actual API call
      await rejectApplication(applicationId, reason);

      // Update local state
      setApplications((prev) => ({
        ...prev,
        [projectId]: prev[projectId].map((app) =>
          app.applicationId === applicationId
            ? { ...app, currentStatus: "REJECTED", rejectionReason: reason }
            : app
        ),
      }));
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert("Failed to reject application");
    } finally {
      setProcessingApp(null);
    }
  };

  const toggleProject = (projectId) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusClass = (status) => {
    switch (status) {
      case "APPLIED":
        return "applied";
      case "APPROVED":
        return "approved";
      case "REJECTED":
        return "rejected";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="pam-loading-screen">
        <div className="pam-loading-inner">
          <div className="pam-spinner" />
          <p className="pam-loading-text">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pam-page">
      <div className="pam-container">
        {/* Header */}
        <div className="pam-card pam-header">
          <h1 className="pam-title">Project Applications</h1>
          <p className="pam-subtitle">
            Review and manage employee applications for published projects
          </p>
        </div>

        {/* Projects List */}
        <div className="pam-projects">
          {projects.map((project) => {
            const projectApps = applications[project.id] || [];
            const pendingCount = projectApps.filter(
              (app) => app.currentStatus === "APPLIED"
            ).length;
            const isExpanded = expandedProjects[project.id];
            console.log("Rendering project:", project);
            return (
              <div key={project.id} className="pam-card pam-project">
                {/* Project Header */}
                <button
                  onClick={() => toggleProject(project.id)}
                  className="pam-project-toggle"
                  type="button"
                >
                  <div className="pam-project-left">
                    <div className="pam-project-top">
                      <h2 className="pam-project-name">
                        {project.description}
                      </h2>
                      <span className="pam-project-id">({project.id})</span>
                      {pendingCount > 0 && (
                        <span className="pam-pending-badge">
                          {pendingCount} Pending
                        </span>
                      )}
                    </div>

                    <div className="pam-project-meta">
                      <span className="pam-meta-item">
                        <User size={16} />
                        {project.requiredEmployees} employees needed
                      </span>
                      <span className="pam-meta-item">
                        <Briefcase size={16} />
                        {projectApps.length} applications
                      </span>
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </button>

                {/* Applications List */}
                {isExpanded && (
                  <div className="pam-expanded">
                    {projectApps.length === 0 ? (
                      <div className="pam-empty">
                        <AlertCircle size={48} className="pam-empty-icon" />
                        <p>No applications yet for this project</p>
                      </div>
                    ) : (
                      <div className="pam-apps">
                        {projectApps.map((app) => {
                          const employee = employeeById[app.employeeId];
                          const fullName = employee
                            ? `${employee.firstName ?? ""} ${
                                employee.lastName ?? ""
                              }`.trim()
                            : `Employee #${app.employeeId}`;
                          const skills = employee?.skills ?? [];

                          return (
                            <div key={app.id} className="pam-app">
                              <div className="pam-app-row">
                                <div className="pam-app-main">
                                  <div className="pam-app-header">
                                    <div className="pam-avatar">
                                      <User size={20} />
                                    </div>

                                    <div>
                                      <h3 className="pam-app-title">
                                        {fullName}
                                      </h3>
                                      <p className="pam-app-subtitle">
                                        Employee ID: {app.employeeId}
                                      </p>
                                      <p className="pam-app-subtitle">
                                        Application ID: {app.applicationId}
                                      </p>
                                    </div>

                                    <span
                                      className={`pam-status ${statusClass(
                                        app.currentStatus
                                      )}`}
                                    >
                                      {app.currentStatus}
                                    </span>
                                  </div>

                                  {skills.length > 0 && (
                                    <div className="pam-skills">
                                      {skills.map((skill) => (
                                        <span
                                          key={skill}
                                          className="pam-skill-chip"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  <div className="pam-details">
                                    <div className="pam-detail">
                                      <Briefcase size={16} />
                                      <span>
                                        <strong>Applied Role:</strong>{" "}
                                        {app.projectRole}
                                      </span>
                                    </div>

                                    <div className="pam-detail">
                                      <Calendar size={16} />
                                      <span>
                                        <strong>Applied:</strong>{" "}
                                        {formatDate(app.timestamps.appliedAt)}
                                      </span>
                                    </div>
                                  </div>

                                  {app.initiatedBy && (
                                    <div className="pam-info-line">
                                      <User size={16} />
                                      <strong>Initiated by:</strong>{" "}
                                      {app.initiatedBy.role}
                                      {app.initiatedBy.userName &&
                                        ` (${app.initiatedBy.userName})`}
                                    </div>
                                  )}

                                  {app.suggestedBy && (
                                    <div className="pam-info-line">
                                      <strong>Suggested by:</strong>{" "}
                                      {app.suggestedBy.role}
                                      {app.suggestedBy.userName &&
                                        ` (${app.suggestedBy.userName})`}
                                    </div>
                                  )}

                                  {app.rejectionReason && (
                                    <div className="pam-rejection">
                                      <p>
                                        <strong>Rejection Reason:</strong>{" "}
                                        {app.rejectionReason}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                {app.currentStatus === "APPLIED" && (
                                  <div className="pam-actions">
                                    <button
                                      onClick={() =>
                                        handleApprove(
                                          app.applicationId,
                                          project.id
                                        )
                                      }
                                      disabled={
                                        processingApp === app.applicationId
                                      }
                                      className="pam-btn pam-btn-approve"
                                      type="button"
                                    >
                                      <CheckCircle size={18} />
                                      {processingApp === app.applicationId
                                        ? "Processing..."
                                        : "Approve"}
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleReject(
                                          app.applicationId,
                                          project.id
                                        )
                                      }
                                      disabled={
                                        processingApp === app.applicationId
                                      }
                                      className="pam-btn pam-btn-reject"
                                      type="button"
                                    >
                                      <XCircle size={18} />
                                      {processingApp === app.applicationId
                                        ? "Processing..."
                                        : "Reject"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {projects.length === 0 && (
          <div className="pam-card pam-noprojects">
            <AlertCircle size={64} className="pam-noprojects-icon" />
            <h2 className="pam-noprojects-title">No Published Projects</h2>
            <p className="pam-noprojects-text">
              There are no published projects with applications to review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectApprovalsManager;
