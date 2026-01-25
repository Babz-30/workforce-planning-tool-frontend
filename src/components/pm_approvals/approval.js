import { useState, useEffect, useMemo } from "react";
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
const FilterSortControls = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
}) => {
  return (
    <div
      className="filter-sort-controls"
      style={{
        display: "flex",
        gap: "1rem",
        marginBottom: "1.5rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div className="search-box" style={{ flex: "1", minWidth: "250px" }}>
        <input
          type="text"
          placeholder="Search by project name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem 1rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "0.95rem",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <label style={{ fontWeight: "500", fontSize: "0.9rem" }}>
          Sort by:
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="date-asc">Start Date (Earliest)</option>
          <option value="date-desc">Start Date (Latest)</option>
          <option value="apps-desc">Most Applications</option>
          <option value="apps-asc">Least Applications</option>
          <option value="pending-desc">Most Pending</option>
          <option value="pending-asc">Least Pending</option>
        </select>
      </div>
    </div>
  );
};

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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);

        const projectsData = keepPublishedProjects(allProjectsData);
        const applicationsData = keepOnlyExistingProjects(
          allApplicationData,
          projectsData,
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
  const filteredAndSortedProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    // Filter by project.description (your UI uses project.description)
    const filtered = projects.filter((p) =>
      (p?.description || "").toLowerCase().includes(term),
    );

    // Add derived counts for sorting
    const enriched = filtered.map((p) => {
      const projectApps = applications[p.id] || [];
      const reviewApps = projectApps.filter(
        (a) => a.currentStatus !== "COMPLETED",
      );
      const pendingCount = reviewApps.filter(
        (a) => a.currentStatus === "APPLIED",
      ).length;

      // start/end field names depend on your project object (keep safe)
      const start =
        p.projectStart || p.start || p.startDate || p.projectStartDate || null;

      return {
        ...p,
        _appsCount: projectApps.length,
        _pendingCount: pendingCount,
        _startDate: start,
      };
    });

    return [...enriched].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return (a.description || "").localeCompare(b.description || "");
        case "name-desc":
          return (b.description || "").localeCompare(a.description || "");
        case "date-asc":
          return (
            new Date(a._startDate || "2100-01-01") -
            new Date(b._startDate || "2100-01-01")
          );
        case "date-desc":
          return (
            new Date(b._startDate || "1900-01-01") -
            new Date(a._startDate || "1900-01-01")
          );
        case "apps-desc":
          return (b._appsCount || 0) - (a._appsCount || 0);
        case "apps-asc":
          return (a._appsCount || 0) - (b._appsCount || 0);
        case "pending-desc":
          return (b._pendingCount || 0) - (a._pendingCount || 0);
        case "pending-asc":
          return (a._pendingCount || 0) - (b._pendingCount || 0);
        default:
          return 0;
      }
    });
  }, [projects, applications, searchTerm, sortBy]);

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
            : app,
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
            : app,
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
      case "COMPLETED":
        return "completed";
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
        <FilterSortControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Projects List */}
        <div className="pam-projects">
          {filteredAndSortedProjects.map((project) => {
            const projectApps = applications[project.id] || [];

            // ✅ members = COMPLETED
            const memberApps = projectApps.filter(
              (app) => app.currentStatus === "COMPLETED",
            );

            // ✅ keep the approvals list clean (everything except COMPLETED)
            const reviewApps = projectApps.filter(
              (app) => app.currentStatus !== "COMPLETED",
            );

            const pendingCount = reviewApps.filter(
              (app) => app.currentStatus === "APPLIED",
            ).length;
            // const memberCount = memberApps.length;
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
                      {/* <span className="pam-meta-item">
                        <User size={16} />
                        {memberCount} members in project
                      </span> */}
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </button>
                {/* ✅ Project Members (COMPLETED applications) */}
                {memberApps.length > 0 && (
                  <div className="pam-members">
                    <div className="pam-members-title">Project Members</div>

                    <div className="pam-members-list">
                      {memberApps.map((app) => {
                        const employee = employeeById[app.employeeId];
                        const fullName = employee
                          ? `${employee.firstName ?? ""} ${employee.lastName ?? ""}`.trim()
                          : `Employee #${app.employeeId}`;

                        return (
                          <span key={app.id} className="pam-member-chip">
                            {fullName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

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
                        {reviewApps.map((app) => {
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
                                        app.currentStatus,
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
                                          project.id,
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
                                          project.id,
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
