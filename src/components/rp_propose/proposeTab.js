import React, { useState, useMemo } from "react";
import Pagination from "../pagination/Pagination";
import "./proposeCard.css";
import { ProposeProject } from "../../services/application/ProposeAPI";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const ProjectCard = ({
  project,
  employees,
  onPropose,
  proposedEmployees,
  appliedEmployees,
}) => {
  const totalPositions =
    project.roles?.reduce(
      (sum, role) => sum + parseInt(role.numberOfEmployees || 0),
      0
    ) || 0;

  return (
    <div className="project-card">
      <div className="project-header">
        <div className="project-info-header">
          <div className="project-title">{project.name}</div>
          <span className="project-date">
            Project Start: {formatDate(project.startDate)} &nbsp;–&nbsp; Project
            End: {formatDate(project.endDate)}
          </span>
          <span className="positions-badge">
            {totalPositions} position{totalPositions !== 1 ? "s" : ""} open
          </span>
        </div>
      </div>

      <div className="roles-section">
        {project.roles && project.roles.length > 0 ? (
          project.roles.map((role, index) => (
            <RoleSection
              key={index}
              role={role}
              project={project}
              employees={employees}
              onPropose={onPropose}
              proposedEmployees={proposedEmployees}
              appliedEmployees={appliedEmployees}
            />
          ))
        ) : (
          <p className="no-roles">No roles defined for this project</p>
        )}
      </div>
    </div>
  );
};

// ------------------
// Role Section
// ------------------
const RoleSection = ({
  role,
  project,
  employees,
  onPropose,
  proposedEmployees,
  appliedEmployees,
}) => {
  // Get applied employee IDs for this project
  const appliedEmployeeIds = appliedEmployees[project.id] || [];

  const recommendedEmployees = employees.filter((emp) => {
    // Check if employee matches required competencies
    const hasMatchingSkills = role.requiredCompetencies.some((skill) =>
      emp.skills.includes(skill)
    );

    // Check if employee has already been proposed for this role
    const employeeKey = `${project.id}-${role.requiredRole}-${emp.id}`;
    const alreadyProposed = proposedEmployees.has(employeeKey);

    // Check if employee has already applied to this project
    const alreadyApplied = appliedEmployeeIds.includes(emp.id);

    return hasMatchingSkills && !alreadyProposed && !alreadyApplied;
  });

  // Get already applied employees who match the role requirements
  const alreadyAppliedEmployees = employees.filter((emp) => {
    const hasMatchingSkills = role.requiredCompetencies.some((skill) =>
      emp.skills.includes(skill)
    );
    const isApplied = appliedEmployeeIds.includes(emp.id);

    return hasMatchingSkills && isApplied;
  });

  return (
    <div className="role-section">
      <div className="role-header">
        <h4 className="role-title">{role.requiredRole}</h4>
        <span className="role-positions-badge">
          {role.numberOfEmployees} position
          {parseInt(role.numberOfEmployees) > 1 ? "s" : ""} • {role.capacity}{" "}
          Hours/Week
        </span>
      </div>

      <div className="role-skills">
        <span className="required-skills-label">
          Required Competencies / Skills:
        </span>
        {role.requiredCompetencies.map((skill) => (
          <span key={skill} className="skill-badge skill-badge-purple">
            {skill}
          </span>
        ))}
      </div>

      <div className="candidates-section">
        <h4 className="candidates-title">Recommended Candidates:</h4>

        {recommendedEmployees.length === 0 && (
          <p className="no-candidates">No matching candidates found</p>
        )}

        {recommendedEmployees.map((employee) => (
          <CandidateItem
            key={employee.id}
            employee={employee}
            project={project}
            role={role}
            onPropose={onPropose}
          />
        ))}
      </div>

      {alreadyAppliedEmployees.length > 0 && (
        <div
          className="applied-candidates-section"
          style={{ marginTop: "1.5rem" }}
        >
          <h4 className="candidates-title" style={{ color: "#666" }}>
            Already Applied:
          </h4>
          {alreadyAppliedEmployees.map((employee) => (
            <AppliedCandidateItem
              key={employee.id}
              employee={employee}
              role={role}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ------------------
// Candidate Item
// ------------------
const CandidateItem = ({ employee, project, role, onPropose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const matchingSkills = employee.skills.filter((skill) =>
    role.requiredCompetencies.includes(skill)
  );

  const handlePropose = async () => {
    setIsLoading(true);
    try {
      await onPropose(employee, project, role);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="candidate-item">
      <div className="candidate-info">
        <p className="candidate-name">{employee.name}</p>
        <p className="candidate-match">
          Matching skills: {matchingSkills.join(", ")}
        </p>
      </div>

      <button
        className={`propose-btn ${isLoading ? "loading" : ""}`}
        onClick={handlePropose}
        disabled={isLoading}
      >
        {isLoading ? "" : "Propose"}
      </button>
    </div>
  );
};

// ------------------
// Already Applied Candidate Item
// ------------------
const AppliedCandidateItem = ({ employee, role }) => {
  const matchingSkills = employee.skills.filter((skill) =>
    role.requiredCompetencies.includes(skill)
  );

  return (
    <div
      className="candidate-item"
      style={{ opacity: 0.7, backgroundColor: "#f9f9f9" }}
    >
      <div className="candidate-info">
        <p className="candidate-name">{employee.name}</p>
        <p className="candidate-match">
          Matching skills: {matchingSkills.join(", ")}
        </p>
      </div>

      <span
        className="applied-badge"
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#e8f4f8",
          color: "#0066cc",
          borderRadius: "4px",
          fontSize: "0.85rem",
          fontWeight: "500",
        }}
      >
        Applied
      </span>
    </div>
  );
};

// ------------------
// API Service
// ------------------
const suggestEmployee = async (projectId, projectRole, employeeId) => {
  try {
    const response = await ProposeProject(projectId, projectRole, employeeId);
    console.log("API Response:", response);

    if (response.status === 201) {
      return { success: true, status: 201, response };
    } else if (response.status === 409) {
      return {
        success: false,
        status: 409,
        error: "Employee already suggested",
        response,
      };
    } else {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error suggesting employee:", error);
    return { success: false, status: 500, error: error.message };
  }
};

// ------------------
// Filter and Sort Controls
// ------------------
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

      <div
        className="sort-controls"
        style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
      >
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
          <option value="positions-desc">Most Positions</option>
          <option value="positions-asc">Least Positions</option>
        </select>
      </div>
    </div>
  );
};

// ------------------
// Propose Tab Content
// ------------------
const ProposeTabContent = ({
  projects,
  employees,
  proposePage,
  setProposePage,
  plannerUserId,
  ITEMS_PER_PAGE,
  paginateItems,
  loading,
  onProposeSuccess,
  onProposeError,
  appliedEmployees = {}, // Add this new prop
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [proposedEmployees, setProposedEmployees] = useState(new Set());

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate total positions for sorting
    const projectsWithPositions = filtered.map((project) => ({
      ...project,
      totalPositions:
        project.roles?.reduce(
          (sum, role) => sum + parseInt(role.numberOfEmployees || 0),
          0
        ) || 0,
    }));

    // Sort based on selected option
    const sorted = [...projectsWithPositions].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "date-asc":
          return new Date(a.startDate) - new Date(b.startDate);
        case "date-desc":
          return new Date(b.startDate) - new Date(a.startDate);
        case "positions-desc":
          return b.totalPositions - a.totalPositions;
        case "positions-asc":
          return a.totalPositions - b.totalPositions;
        default:
          return 0;
      }
    });

    return sorted;
  }, [projects, searchTerm, sortBy]);

  const handlePropose = async (employee, project, role) => {
    const result = await suggestEmployee(
      project.id,
      role.requiredRole,
      employee.id
    );

    const employeeKey = `${project.id}-${role.requiredRole}-${employee.id}`;

    if (result.status === 201) {
      // Success - remove employee from recommended list
      setProposedEmployees((prev) => new Set(prev).add(employeeKey));

      // Move employee to applied list
      if (onProposeSuccess) {
        onProposeSuccess(employee, project, role, result.data);
      }

      alert(`Successfully proposed ${employee.name} for ${role.requiredRole}`);
    } else if (result.status === 409) {
      // Already suggested - remove employee from list
      setProposedEmployees((prev) => new Set(prev).add(employeeKey));

      if (onProposeError) {
        onProposeError(employee, project, role, result.error);
      }

      alert(
        `${employee.name} has already been suggested for ${role.requiredRole}`
      );
    } else {
      // Other errors - keep employee in list
      console.error("Failed to propose employee:", result.error);

      if (onProposeError) {
        onProposeError(employee, project, role, result.error);
      }

      alert(`Failed to propose employee: ${result.error}`);
    }
  };

  if (loading) {
    return (
      <div className="content-card">
        <h2 className="section-title">Propose Employees for Projects</h2>
        <FilterSortControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <div style={{ textAlign: "center" }}>Loading Projects...</div>
      </div>
    );
  }

  return (
    <div className="content-card">
      <h2 className="section-title">Propose Employees for Projects</h2>

      <FilterSortControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {filteredAndSortedProjects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
          No projects found matching "{searchTerm}"
        </div>
      ) : (
        <>
          <div className="project-list">
            {paginateItems(filteredAndSortedProjects, proposePage).map(
              (project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  employees={employees}
                  onPropose={handlePropose}
                  proposedEmployees={proposedEmployees}
                  appliedEmployees={appliedEmployees}
                />
              )
            )}
          </div>
          <Pagination
            currentPage={proposePage}
            totalItems={filteredAndSortedProjects.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setProposePage}
          />
        </>
      )}
    </div>
  );
};

export default ProposeTabContent;
