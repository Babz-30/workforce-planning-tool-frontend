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

const ProjectApprovalsManager = () => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case "APPLIED":
        return "bg-blue-100 text-blue-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Project Applications
          </h1>
          <p className="text-gray-600 mt-2">
            Review and manage employee applications for published projects
          </p>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {projects.map((project) => {
            const projectApps = applications[project.projectId] || [];
            const pendingCount = projectApps.filter(
              (app) => app.currentStatus === "APPLIED"
            ).length;
            const isExpanded = expandedProjects[project.projectId];

            return (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {/* Project Header */}
                <button
                  onClick={() => toggleProject(project.projectId)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {project.projectDescription}
                      </h2>
                      <span className="text-sm text-gray-500">
                        ({project.projectId})
                      </span>
                      {pendingCount > 0 && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          {pendingCount} Pending
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User size={16} />
                        {project.requiredEmployees} employees needed
                      </span>
                      <span className="flex items-center gap-1">
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
                  <div className="border-t border-gray-200">
                    {projectApps.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <AlertCircle
                          size={48}
                          className="mx-auto mb-3 opacity-50"
                        />
                        <p>No applications yet for this project</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {projectApps.map((app) => (
                          <div
                            key={app.id}
                            className="p-6 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User size={20} className="text-blue-600" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900">
                                      Employee ID: {app.employeeId}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      Application ID: {app.applicationId}
                                    </p>
                                  </div>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                      app.currentStatus
                                    )}`}
                                  >
                                    {app.currentStatus}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Briefcase size={16} />
                                    <span>
                                      <strong>Role:</strong> {app.projectRole}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar size={16} />
                                    <span>
                                      <strong>Applied:</strong>{" "}
                                      {formatDate(app.timestamps.appliedAt)}
                                    </span>
                                  </div>
                                </div>

                                {app.initiatedBy && (
                                  <div className="text-sm text-gray-600 mb-2">
                                    <strong>Initiated by:</strong>{" "}
                                    {app.initiatedBy.role}
                                    {app.initiatedBy.userName &&
                                      ` (${app.initiatedBy.userName})`}
                                  </div>
                                )}

                                {app.suggestedBy && (
                                  <div className="text-sm text-gray-600 mb-2">
                                    <strong>Suggested by:</strong>{" "}
                                    {app.suggestedBy.role}
                                    {app.suggestedBy.userName &&
                                      ` (${app.suggestedBy.userName})`}
                                  </div>
                                )}

                                {app.rejectionReason && (
                                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                                    <p className="text-sm text-red-800">
                                      <strong>Rejection Reason:</strong>{" "}
                                      {app.rejectionReason}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons */}
                              {app.currentStatus === "APPLIED" && (
                                <div className="flex gap-2 ml-4">
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
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <AlertCircle size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Published Projects
            </h2>
            <p className="text-gray-600">
              There are no published projects with applications to review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectApprovalsManager;
