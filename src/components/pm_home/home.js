import { useEffect, useMemo, useState } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";

import Pagination from "../pagination/Pagination";
import Search from "../../components/pm_search/search"; // ✅ change this path to your existing Search component
// import { GetProjectByCreator } from "../../services/project/getprojects";
import { publishProject } from "../../services/project/patchprojects";

export default function HomeTab({ allProjects }) {
  const navigate = useNavigate();

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);

  const [projects, setProjects] = useState(allProjects || []);

  useEffect(() => {
    setProjects(allProjects || []);
  }, [allProjects]);
  const [publishingId, setPublishingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState(""); // from Search component
  const ITEMS_PER_PAGE = 5;

  // reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePublish = async (projectId) => {
    setPublishingId(projectId);
    try {
      const response = await publishProject(projectId);
      if (response === 200) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId ? { ...p, isPublished: true } : p
          )
        );
      } else {
        alert("Failed to publish project");
      }
    } catch (e) {
      console.error("Error publishing project:", e);
      alert("Error publishing project: " + e.message);
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

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey)
      return <span className="sort-icon">⇅</span>;
    return (
      <span className="sort-icon-active">
        {sortConfig.direction === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  const filteredProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return projects;

    return projects.filter((p) => {
      const text = [
        p.description,
        p.taskDescription,
        p.location,
        ...(p.roles || []),
        ...(p.competencies || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(term);
    });
  }, [projects, searchTerm]);

  const sortedProjects = useMemo(() => {
    if (!sortConfig.key) return filteredProjects;

    const sorted = [...filteredProjects].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "startDate" || sortConfig.key === "endDate") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredProjects, sortConfig]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = sortedProjects.slice(startIndex, endIndex);

  // if (loading) {
  //   return (
  //     <div className="pm-home">
  //       <div className="text-center mt-5">
  //         <div className="spinner-border text-primary" role="status">
  //           <span className="visually-hidden">Loading...</span>
  //         </div>
  //         <p className="mt-3">Loading projects...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="pm-home">
  //       <div className="alert alert-danger mt-5" role="alert">
  //         <h4 className="alert-heading">Error!</h4>
  //         <p>{error}</p>
  //         <button
  //           className="btn btn-primary"
  //           onClick={() => window.location.reload()}
  //         >
  //           Retry
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="pm-home">
      <div className="pm-home-header d-flex justify-content-between align-items-center">
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

      {/* Search (you already have a component) */}
      <div className="pm-home-search">
        {/* Adjust props to match YOUR Search component API */}
        <Search
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search projects..."
        />
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
                      <p className="project-desc">{project.taskDescription}</p>

                      <div className="chips-container">
                        {(project.competencies || []).map((comp, idx) => (
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
                        <span className="date-value">{project.startDate}</span>
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
                          {(project.roles || []).map((role, idx) => (
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

                      {!project.isPublished && (
                        <button
                          type="button"
                          className="btn btn-warning"
                          onClick={() =>
                            navigate(
                              `/project_manager/edit-project/${project.id}`
                            )
                          }
                        >
                          Edit
                        </button>
                      )}

                      <button
                        type="button"
                        className={`btn ${
                          project.isPublished ? "btn-secondary" : "btn-success"
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

              {currentProjects.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <div className="pm-home-empty">
                      No projects match your search.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer + Pagination (your component) */}
      <div className="footer">
        <span className="footer-text">
          Showing {sortedProjects.length === 0 ? 0 : startIndex + 1}-
          {Math.min(endIndex, sortedProjects.length)} of {sortedProjects.length}{" "}
          projects
        </span>

        <Pagination
          currentPage={currentPage}
          totalItems={sortedProjects.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
