import { useState } from "react";
import "../../pages/resource_planner/ResourcePlanner.css";

const EmployeeSearch = ({
  employees,
  loading,
  error,
  allSkills,
  ITEMS_PER_PAGE,
  Pagination,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
    setSearchPage(1);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      searchTerm === "" ||
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.every((skill) => emp.skills.includes(skill));

    return matchesSearch && matchesSkills;
  });

  const paginateItems = (items, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  return (
    <div className="content-card">
      <h2 className="section-title">Search Employees by Skills</h2>

      {loading && <div className="loading-state">Loading employees...</div>}

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
            <div
              className={`filter-header ${isOpen ? "active" : ""}`}
              onClick={toggleDropdown}
            >
              <label className="form-label">Filter by Skills</label>
              <svg
                className={`dropdown-icon ${isOpen ? "rotated" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <div className={`skills-filter ${isOpen ? "show" : ""}`}>
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
  );
};

export default EmployeeSearch;
