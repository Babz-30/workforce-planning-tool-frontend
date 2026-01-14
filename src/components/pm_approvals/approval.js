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

const ProjectApprovalsManager = ({ allProjectsData, allApplicationData }) => {
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [processingApp, setProcessingApp] = useState(null);

  // Mock API calls - replace with your actual API endpoints
  const fetchProjects = async () => {
    // Simulating API call
    return {
      message: "Projects fetched successfully for isPublished=true",
      data: [
        {
          id: "69238f33a29eb872f2726f89",
          projectId: "PRJ-CMK843",
          projectDescription: "OCR",
          requiredEmployees: 4,
          roles: [
            { requiredRole: "Blockchain Developer", numberOfEmployees: "3" },
            { requiredRole: "Backend Developer", numberOfEmployees: "1" },
          ],
        },
        {
          id: "6929a614ce1ce30ca2f1dffb",
          projectId: "PRJ-HOQ618",
          projectDescription: "AI-Powered Analytics Dashboard",
          requiredEmployees: 10,
          roles: [
            { requiredRole: "Data Scientist", numberOfEmployees: "3" },
            { requiredRole: "ML Engineer", numberOfEmployees: "2" },
          ],
        },
      ],
    };
  };

  const fetchApplications = async () => {
    // Simulating API call
    return {
      "PRJ-CMK843": [
        {
          id: "695ecd970e17901ec5670b36",
          applicationId: "App_PRJ-CMK843_aa850b86",
          projectRole: "Blockchain Developer",
          projectId: "PRJ-CMK843",
          employeeId: 36,
          currentStatus: "APPLIED",
          timestamps: {
            appliedAt: "2026-01-07T21:18:14.404+00:00",
          },
        },
      ],
      "PRJ-HOQ618": [
        {
          id: "69650bd2e9cfeb3a0353bc45",
          applicationId: "App_PRJ-HOQ618_db8d3962",
          projectRole: "ML Engineer",
          projectId: "PRJ-HOQ618",
          employeeId: 10,
          currentStatus: "APPLIED",
          timestamps: {
            appliedAt: "2026-01-12T14:57:22.050+00:00",
          },
        },
      ],
    };
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [projectsData, applicationsData] = await Promise.all([
          fetchProjects(),
          fetchApplications(),
        ]);
        setProjects(projectsData.data);
        setApplications(applicationsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleApprove = async (applicationId, projectId) => {
    setProcessingApp(applicationId);
    try {
      // Replace with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
            const projectApps = applications[project.projectId] || [];
            const pendingCount = projectApps.filter(
              (app) => app.currentStatus === "APPLIED"
            ).length;
            const isExpanded = expandedProjects[project.projectId];

            return (
              <div key={project.id} className="pam-card pam-project">
                {/* Project Header */}
                <button
                  onClick={() => toggleProject(project.projectId)}
                  className="pam-project-toggle"
                  type="button"
                >
                  <div className="pam-project-left">
                    <div className="pam-project-top">
                      <h2 className="pam-project-name">
                        {project.projectDescription}
                      </h2>
                      <span className="pam-project-id">
                        ({project.projectId})
                      </span>
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
                        {projectApps.map((app) => (
                          <div key={app.id} className="pam-app">
                            <div className="pam-app-row">
                              <div className="pam-app-main">
                                <div className="pam-app-header">
                                  <div className="pam-avatar">
                                    <User size={20} />
                                  </div>

                                  <div>
                                    <h3 className="pam-app-title">
                                      Employee ID: {app.employeeId}
                                    </h3>
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

                                <div className="pam-details">
                                  <div className="pam-detail">
                                    <Briefcase size={16} />
                                    <span>
                                      <strong>Role:</strong> {app.projectRole}
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
                                        project.projectId
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
                                        project.projectId
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
                        ))}
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
