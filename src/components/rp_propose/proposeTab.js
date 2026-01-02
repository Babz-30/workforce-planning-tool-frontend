import React, { useState } from "react";
import Pagination from "../pagination/Pagination";
import "./proposeCard.css";

// Updated projects structure with multiple roles

const ProjectCard = ({ project, employees, onPropose }) => {
  const totalPositions =
    project.roles?.reduce(
      (sum, role) => sum + parseInt(role.numberOfEmployees || 0),
      0
    ) || 0;

  return (
    <div className="project-card">
      <div className="project-header">
        <div className="project-info-header">
          <h3 className="project-name">{project.name}</h3>
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
const RoleSection = ({ role, project, employees, onPropose }) => {
  const recommendedEmployees = employees.filter((emp) =>
    role.requiredCompetencies.some((skill) => emp.skills.includes(skill))
  );

  return (
    <div className="role-section">
      <div className="role-header">
        <h4 className="role-title">{role.requiredRole}</h4>
        <span className="role-positions-badge">
          {role.numberOfEmployees} position
          {parseInt(role.numberOfEmployees) > 1 ? "s" : ""} • {role.capacity}
          Hours/Week
        </span>
      </div>

      <div className="role-skills">
        <span className="required-skills-label">Required Competencies:</span>
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
// API Service
// ------------------
const suggestEmployee = async (
  projectId,
  projectRole,
  employeeId,
  plannerUserId
) => {
  try {
    const response = await fetch("http://localhost/api/applications/suggest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: String(projectId),
        projectRole: projectRole,
        employeeId: employeeId,
        plannerUserId: String(plannerUserId),
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error suggesting employee:", error);
    return { success: false, error: error.message };
  }
};

// ------------------
// Propose Tab Content
// ------------------
const ProposeTabContent = ({
  projects,
  employees,
  proposePage,
  setProposePage,
  plannerUserId, // Add this prop
  ITEMS_PER_PAGE,
  paginateItems,
  onProposeSuccess, // Optional callback for success handling
  onProposeError, // Optional callback for error handling
}) => {
  const handlePropose = async (employee, project, role) => {
    const result = await suggestEmployee(
      project.id,
      role.requiredRole,
      employee.id,
      plannerUserId
    );

    if (result.success) {
      console.log("Employee proposed successfully:", result.data);
      if (onProposeSuccess) {
        onProposeSuccess(employee, project, role, result.data);
      }
      // You can add toast notification here
      alert(`Successfully proposed ${employee.name} for ${role.requiredRole}`);
    } else {
      console.error("Failed to propose employee:", result.error);
      if (onProposeError) {
        onProposeError(employee, project, role, result.error);
      }
      // You can add toast notification here
      alert(`Failed to propose employee: ${result.error}`);
    }
  };

  return (
    <div className="content-card">
      <h2 className="section-title">Propose Employees for Projects</h2>
      <div className="project-list">
        {paginateItems(projects, proposePage).map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            employees={employees}
            onPropose={handlePropose}
          />
        ))}
      </div>
      <Pagination
        currentPage={proposePage}
        totalItems={projects.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setProposePage}
      />
    </div>
  );
};

export { ProjectCard, ProposeTabContent, suggestEmployee };
export default ProposeTabContent;
