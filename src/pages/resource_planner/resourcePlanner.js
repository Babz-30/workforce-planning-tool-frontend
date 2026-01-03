import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  TrendingUp,
  CheckCircle,
  UserPlus,
  FileText,
  ExternalLink,
} from "lucide-react";
import "./ResourcePlanner.css";
import { getAllEmployee } from "../../services/employee/employeeApi";
import { transformEmployeesForResourcePlanner } from "../../helper/apiBinder";
import { transformProjectDetails } from "../../helper/apiBinder";
import { GetAllPublishedProject } from "../../services/project/getprojects";
import Pagination from "../../components/pagination/Pagination"; // Import the pagination component
import UserProfile from "../../components/profile/profile";
import ProposeTabContent from "../../components/rp_propose/proposeTab";
import SkillGapAnalysis from "../../components/rp_skill_gap_analysis/skillGapAnalysisTab";
import { calculateSkillGaps } from "../../helper/skillGap";

const ResourcePlanner = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  // Pagination states for different tabs
  const [availablePage, setAvailablePage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [proposePage, setProposePage] = useState(1);
  
  const [staffingPage, setStaffingPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  // Fetch employees from API
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        await getAllEmployee().then((response) => {
          setEmployees(transformEmployeesForResourcePlanner(response.data));
        });

        await GetAllPublishedProject().then((response2) => {
          setProjects(transformProjectDetails(response2));
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  // Reset page when changing tabs or filters
  useEffect(() => {
    setSearchPage(1);
  }, [searchTerm, selectedSkills]);

  const skillGaps = calculateSkillGaps(employees, projects);



  const allSkills = [
    "React",
    "Node.js",
    "Python",
    "Java",
    "Kubernetes",
    "AWS",
    "ML",
    "SQL",
    "Figma",
    "UI/UX",
    "TypeScript",
    "CSS",
  ];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) => emp.skills.includes(skill));
    return matchesSearch && matchesSkills;
  });

  const availableEmployees = filteredEmployees.filter(
    (emp) => emp.capacity > 0
  );

  // Pagination helper function
  const paginateItems = (items, currentPage) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return items.slice(startIndex, endIndex);
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const proposeEmployee = (employee, project) => {
    alert(`Proposing ${employee.name} for ${project.name}`);
  };



  if (loading) {
    return <div className="loading-state">Loading resource planner...</div>;
  }
  return (
    <div className="app-container">
      <div className="app-content">
        {/* Updated Header with UserProfile */}
        <div className="app-header">
          <div className="app-header-content">
            <h1 className="app-title">Resource Planner</h1>
            <p className="app-subtitle">
              Match employees with open project roles
            </p>
          </div>
          <div className="app-header-actions">
            <UserProfile />
          </div>
        </div>
        {/* Navigation Tabs */}
        <div className="nav-container">
          <div className="nav-tabs">
            {[
              { id: "available", label: "Available Employees", icon: Users },
              { id: "search", label: "Search by Skills", icon: Search },
              { id: "propose", label: "Propose for Projects", icon: UserPlus },
              { id: "gaps", label: "Skill Gap Analysis", icon: TrendingUp },
              {
                id: "approvals",
                label: "Approval Requests",
                icon: CheckCircle,
              },
              { id: "staffing", label: "Staffing Records", icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-tab ${
                  activeTab === tab.id ? "nav-tab-active" : ""
                }`}
              >
                <tab.icon className="nav-tab-icon" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Available Employees */}
        {activeTab === "available" && (
          <div className="content-card">
            <h2 className="section-title">Available Employees</h2>
            <div className="employee-list">
              {paginateItems(availableEmployees, availablePage).map((emp) => (
                <div
                  key={emp.id}
                  className="employee-card employee-card-available"
                >
                  <div className="employee-card-content">
                    <div className="employee-info">
                      <h3 className="employee-name">{emp.name}</h3>
                      <p className="employee-role">{emp.role}</p>
                      <div className="skills-container">
                        {emp.skills.map((skill) => (
                          <span
                            key={skill}
                            className="skill-badge skill-badge-blue"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="capacity-display">
                      <div className="capacity-number">{emp.capacity}%</div>
                      <div className="capacity-label">Free Capacity</div>
                    </div>
                  </div>
                  {emp.projects.length > 0 && (
                    <div className="employee-projects">
                      Current: {emp.projects.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Pagination
              currentPage={availablePage}
              totalItems={availableEmployees.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setAvailablePage}
            />
          </div>
        )}

        {/* Search by Skills */}
        {activeTab === "search" && (
          <div className="content-card">
            <h2 className="section-title">Search Employees by Skills</h2>

            {loading && (
              <div className="loading-state">Loading employees...</div>
            )}

            {error && (
              <div className="error-state">
                Error: {error}
                <button
                  onClick={() => window.location.reload()}
                  className="retry-btn"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="search-section">
                  <label className="form-label">Search by Name or Role</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search employees..."
                    className="search-input"
                  />
                </div>

                <div className="filter-section">
                  <label className="form-label">Filter by Skills</label>
                  <div className="skills-filter">
                    {allSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`skill-filter-btn ${
                          selectedSkills.includes(skill)
                            ? "skill-filter-btn-active"
                            : ""
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="employee-list">
                  {filteredEmployees.length > 0 ? (
                    paginateItems(filteredEmployees, searchPage).map((emp) => (
                      <div
                        key={emp.id}
                        className="employee-card employee-card-search"
                      >
                        <div className="employee-card-content">
                          <div className="employee-info">
                            <h3 className="employee-name">{emp.name}</h3>
                            <p className="employee-role">{emp.role}</p>
                            <div className="skills-container">
                              {emp.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className={`skill-badge ${
                                    selectedSkills.includes(skill)
                                      ? "skill-badge-highlighted"
                                      : "skill-badge-normal"
                                  }`}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span
                            className={`availability-badge availability-${emp.availability.toLowerCase()}`}
                          >
                            {emp.availability}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="empty-state">
                      No employees match your search criteria
                    </p>
                  )}
                </div>
                <Pagination
                  currentPage={searchPage}
                  totalItems={filteredEmployees.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setSearchPage}
                />
              </>
            )}
          </div>
        )}

        {/* Propose for Projects */}
        {activeTab === "propose" && (
          // Use the exported projects constant
          <ProposeTabContent
            projects={projects} // Use the projects from the artifact
            employees={employees}
            proposePage={proposePage}
            setProposePage={setProposePage}
            proposeEmployee={proposeEmployee}
            ITEMS_PER_PAGE={ITEMS_PER_PAGE}
            paginateItems={paginateItems}
            loading={loading}
          />
        )}

        {activeTab === "gaps" && (
          <SkillGapAnalysis skillGaps={skillGaps} loading={loading} />
        )}

        {/* Staffing Records */}
        {activeTab === "staffing" && (
          <div className="content-card">
            <h2 className="section-title">Project Staffing Records</h2>
            <p className="section-description">Track who is assigned where</p>

            <div className="staffing-list">
              {paginateItems(
                [
                  {
                    project: "Project Alpha",
                    team: ["Sarah Chen", "Emma Thompson"],
                    start: "2025-10-01",
                    end: "2025-12-31",
                  },
                  {
                    project: "Project Beta",
                    team: ["Maria Garcia"],
                    start: "2025-11-01",
                    end: "2026-01-31",
                  },
                  {
                    project: "Project Gamma",
                    team: ["Emma Thompson"],
                    start: "2025-11-15",
                    end: "2026-02-15",
                  },
                ],
                staffingPage
              ).map((record, idx) => (
                <div key={idx} className="staffing-card">
                  <h3 className="staffing-project-name">{record.project}</h3>
                  <div className="staffing-dates">
                    <div className="date-item">
                      <span className="date-label">Start Date</span>
                      <p className="date-value">{record.start}</p>
                    </div>
                    <div className="date-item">
                      <span className="date-label">End Date</span>
                      <p className="date-value">{record.end}</p>
                    </div>
                  </div>
                  <div className="team-section">
                    <span className="team-label">Team Members</span>
                    <div className="team-members">
                      {record.team.map((member) => (
                        <span key={member} className="team-member-badge">
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={staffingPage}
              totalItems={3}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setStaffingPage}
            />

            <div className="external-search-card">
              <div className="external-search-icon-wrapper">
                <ExternalLink className="external-search-icon" />
              </div>
              <div className="external-search-content">
                <h4 className="external-search-title">
                  Accept External Search
                </h4>
                <p className="external-search-description">
                  Enable integration with external recruitment platforms to
                  source candidates beyond your organization.
                </p>
                <button className="external-search-btn">
                  Configure External Sources
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcePlanner;
