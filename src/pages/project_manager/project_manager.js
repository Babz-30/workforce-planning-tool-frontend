import { useState, useEffect } from "react";
import "./project_manager.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import UserProfile from "../../components/profile/profile";
import { GetProjectByCreator } from "../../services/project/getprojects";
import { publishProject } from "../../services/project/patchprojects";

export default function ProjectTable() {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publishingId, setPublishingId] = useState(null); // Track which project is being published
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        let res = await GetProjectByCreator();
        setProjects(res);
        setError(null);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle publish function
  const handlePublish = async (projectId) => {
    setPublishingId(projectId);

    try {
      const response = await publishProject(projectId);
      if (response === 200) {
        // Mark project as published
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === projectId
              ? { ...project, isPublished: true }
              : project
          )
        );
      } else {
        console.error("Failed to publish project");
        alert("Failed to publish project");
      }
    } catch (error) {
      console.error("Error publishing project:", error);
      alert("Error publishing project: " + error.message);
      return { success: false };
    } finally {
      setPublishingId(null);
    }
  };

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortedProjects = () => {
    if (!sortConfig.key) return projects;

    const sorted = [...projects].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "startDate" || sortConfig.key === "endDate") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <span className="sort-icon">⇅</span>;
    }
    return (
      <span className="sort-icon-active">
        {sortConfig.direction === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  const sortedProjects = getSortedProjects();
  const unpublishedProjects = sortedProjects;

  /*This is the code to filter out published projects, but currently commented out*/

  // Filter out published projects
  // const unpublishedProjects = sortedProjects.filter(
  //   (project) => !project.isPublished
  // );

  const totalPages = Math.ceil(unpublishedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = unpublishedProjects.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Loading state
  if (loading) {
    return (
      <div className="project-manager-page">
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
          <div className="container-fluid max-w-custom d-flex justify-between align-items-center">
            <ul className="nav nav-tabs gap-4">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#home">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/home">
                  Staffing
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/project_manager">
                  Approvals
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" aria-disabled="true" href="/">
                  Disabled
                </a>
              </li>
            </ul>
            <UserProfile />
          </div>
        </nav>
        <div className="container">
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="project-manager-page">
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
          <div className="container-fluid max-w-custom d-flex justify-between align-items-center">
            <ul className="nav nav-tabs gap-4">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#home">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/home">
                  Staffing
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/project_manager">
                  Approvals
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" aria-disabled="true" href="/">
                  Disabled
                </a>
              </li>
            </ul>
            <UserProfile />
          </div>
        </nav>
        <div className="container">
          <div className="alert alert-danger mt-5" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-manager-page">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container-fluid max-w-custom d-flex justify-between align-items-center">
          <ul className="nav nav-tabs gap-4">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#home">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/home">
                Staffing
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/project_manager">
                Approvals
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" aria-disabled="true" href="/">
                Disabled
              </a>
            </li>
          </ul>
          <UserProfile />
        </div>
      </nav>
      <div className="container">
        <div className="header d-flex justify-content-between align-items-center">
          <div>
            <h1 className="title">Project Management</h1>
            <p className="subtitle">Manage and track all active projects</p>
          </div>

          <button
            type="button"
            className="btn-add-project"
            onClick={() => navigate("/project_manager/create-project")}
          >
            Add Project
          </button>
        </div>

        <div className="table-card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th onClick={() => sortData("description")}>
                    <div className="th-content">
                      Project Details
                      <SortIcon columnKey="description" />
                    </div>
                  </th>
                  <th onClick={() => sortData("startDate")}>
                    <div className="th-content">
                      Timeline
                      <SortIcon columnKey="startDate" />
                    </div>
                  </th>
                  <th onClick={() => sortData("requiredEmployees")}>
                    <div className="th-content">
                      Team Requirements
                      <SortIcon columnKey="requiredEmployees" />
                    </div>
                  </th>
                  <th onClick={() => sortData("location")}>
                    <div className="th-content">
                      Location & Links
                      <SortIcon columnKey="location" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentProjects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div className="project-details">
                        <h3 className="project-title">{project.description}</h3>
                        <p className="project-desc">
                          {project.taskDescription}
                        </p>
                        <div className="chips-container">
                          {project.competencies.map((comp, idx) => (
                            <span key={idx} className="chip">
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="timeline-container">
                        <div className="date-row">
                          <span className="date-label">Start:</span>
                          <span className="date-value">
                            {project.startDate}
                          </span>
                        </div>
                        <div className="date-row">
                          <span className="date-label">End:</span>
                          <span className="date-value">{project.endDate}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="team-container">
                        <div className="employee-count">
                          👥 {project.requiredEmployees} employees
                        </div>
                        <div className="roles-section">
                          <p className="roles-label">Roles:</p>
                          <div className="roles-container">
                            {project.roles.map((role, idx) => (
                              <span key={idx} className="role-badge">
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="capacity">
                          ⏱️ {project.capacity} Hours/Week
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="location-container">
                        <div className="location">📍 {project.location}</div>
                        <button
                          type="button"
                          className="btn btn-warning"
                          onClick={() =>
                            navigate(
                              `/project_manager/edit-project/${project.id}`
                            )
                          }
                        >
                          Edit/Delete
                        </button>
                        {/* <button
                          type="button"
                          className="btn btn-success"
                          onClick={() => handlePublish(project.id)}
                          disabled={
                            project.isPublished || publishingId === project.id
                          }
                        >
                          {project.isPublished
                            ? "Published ✓"
                            : publishingId === project.id
                            ? "Publishing..."
                            : "Publish"}
                        </button> */}
                        <button
                          type="button"
                          className={`btn ${
                            project.isPublished
                              ? "btn-secondary"
                              : "btn-success"
                          }`}
                          onClick={() => handlePublish(project.id)}
                          disabled={
                            project.isPublished || publishingId === project.id
                          }
                        >
                          {project.isPublished
                            ? "Published ✓"
                            : publishingId === project.id
                            ? "Publishing..."
                            : "Publish"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="footer">
          <span className="footer-text">
            Showing {startIndex + 1}-
            {Math.min(endIndex, unpublishedProjects.length)} of{" "}
            {unpublishedProjects.length} projects
          </span>
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  className={`pagination-number ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="pagination-button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
