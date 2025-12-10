import React, { useEffect, useState } from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';
import { getPublishedProjects, applyForProject } from '../../services/employee/publishedProjectApi';

export default function PublishedProjects({
  sortConfig,
  setSortConfig,
  currentPage,
  setCurrentPage,
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  tempFilters,
  setTempFilters,
  filters,
  setFilters
}) {
  const [publishedProjects, setPublishedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  // Fetch published projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projects = await getPublishedProjects(true);
        setPublishedProjects(projects);
        setError(null);
      } catch (err) {
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleApplyProject = async (projectId) => {
    const confirmed = window.confirm("Are you sure you want to apply for this project?");
    if (!confirmed) return;

    try {
      // Get employee data from localStorage
      const employeeData = JSON.parse(localStorage.getItem("loginResponse") || "{}");

      await applyForProject(projectId, {
        employeeId: employeeData.id || employeeData.employeeId,
        employeeName: employeeData.name || employeeData.username,
        message: "I am interested in this project",
      });

      alert(`Application submitted successfully for Project ID: ${projectId}`);
    } catch (error) {
      console.error("Error applying for project:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  const isPublishedInTimeRange = (publishedDate) => {
    if (!filters.publishedTimeRange) return true;

    const projectDate = new Date(publishedDate);
    const today = new Date();
    const diffTime = Math.abs(today - projectDate);
    const diffHours = diffTime / (1000 * 60 * 60);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (filters.publishedTimeRange) {
      case '24hours':
        return diffHours <= 24;
      case '1week':
        return diffDays <= 7;
      case '1month':
        return diffDays <= 30;
      default:
        return true;
    }
  };

  const isWithinDateRange = (projectStartDate, projectEndDate) => {
    if (!filters.startDate && !filters.endDate) return true;

    const projStart = new Date(projectStartDate);
    const projEnd = new Date(projectEndDate);

    // Start Date Filter: Show all projects that start from the selected date onwards
    if (filters.startDate && !filters.endDate) {
      const filterStart = new Date(filters.startDate);
      return projStart >= filterStart;
    }

    // End Date Filter: Show all projects that finish before or on the selected date
    if (!filters.startDate && filters.endDate) {
      const filterEnd = new Date(filters.endDate);
      return projEnd <= filterEnd;
    }

    // Both filters: Show projects that start from startDate and end before endDate
    if (filters.startDate && filters.endDate) {
      const filterStart = new Date(filters.startDate);
      const filterEnd = new Date(filters.endDate);
      return projStart >= filterStart && projEnd <= filterEnd;
    }

    return true;
  };

  const getFilteredProjects = () => {
    let filtered = publishedProjects;

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.description.toLowerCase().includes(query) ||
          project.taskDescription.toLowerCase().includes(query) ||
          project.competencies.some((comp) => comp.toLowerCase().includes(query)) ||
          project.roles.some((role) => role.toLowerCase().includes(query))
      );
    }

    // Role filter
    if (filters.role) {
      filtered = filtered.filter((project) =>
        project.roles.some((role) => role.toLowerCase().includes(filters.role.toLowerCase()))
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter((project) =>
        project.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Skills filter
    if (filters.skills) {
      filtered = filtered.filter((project) =>
        project.competencies.some((comp) =>
          comp.toLowerCase().includes(filters.skills.toLowerCase())
        )
      );
    }

    // Published time range filter
    if (filters.publishedTimeRange) {
      filtered = filtered.filter((project) => isPublishedInTimeRange(project.publishedDate));
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      filtered = filtered.filter((project) =>
        isWithinDateRange(project.startDate, project.endDate)
      );
    }

    return filtered;
  };

  const getSortedProjects = () => {
    const filtered = getFilteredProjects();

    if (!sortConfig.key) return filtered;

    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'startDate' || sortConfig.key === 'endDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  };

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const emptyFilters = {
      role: '',
      location: '',
      skills: '',
      publishedTimeRange: '',
      startDate: '',
      endDate: ''
    };
    setFilters(emptyFilters);
    setTempFilters(emptyFilters);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const hasActiveFilters = () => {
    return tempFilters.role || tempFilters.location || tempFilters.skills ||
      tempFilters.publishedTimeRange || tempFilters.startDate || tempFilters.endDate;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <span className="sort-icon">⇅</span>;
    }
    return (
      <span className="sort-icon-active">
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  const sortedProjects = getSortedProjects();
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = sortedProjects.slice(startIndex, endIndex);

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
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Loading UI
  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p className="loader-text">Loading published projects...</p>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p className="error-title">Failed to load projects</p>
        <p className="error-message">{error}</p>
        <button
          className="retry-btn"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="employee-container">
      <div className="employee-header">
        <div>
          <h2 style={{ color: "#1e3a8a", fontSize: "26px" }} className="employee-title">Available Projects</h2>
          <p className="employee-subtitle">Browse and apply for published projects</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-box-wrapper">
          <div className="search-input-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search projects by title, description, skills, or roles..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="clear-search-btn"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-toggle-btn ${hasActiveFilters() ? 'has-filters' : ''}`}
          >
            <Filter size={18} />
            Filters
            {hasActiveFilters() && (
              <span className="filter-badge"></span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel" onKeyPress={handleKeyPress}>
            <div className="filters-grid">
              <div className="filter-item">
                <label className="filter-label">Role</label>
                <input
                  type="text"
                  placeholder="e.g., Frontend Dev"
                  value={tempFilters.role}
                  onChange={(e) => setTempFilters({ ...tempFilters, role: e.target.value })}
                  className="filter-input"
                />
              </div>

              <div className="filter-item">
                <label className="filter-label">Location</label>
                <input
                  type="text"
                  placeholder="e.g., Remote, New York"
                  value={tempFilters.location}
                  onChange={(e) => setTempFilters({ ...tempFilters, location: e.target.value })}
                  className="filter-input"
                />
              </div>

              <div className="filter-item">
                <label className="filter-label">Skills</label>
                <input
                  type="text"
                  placeholder="e.g., React, Python"
                  value={tempFilters.skills}
                  onChange={(e) => setTempFilters({ ...tempFilters, skills: e.target.value })}
                  className="filter-input"
                />
              </div>

              <div className="filter-item">
                <label className="filter-label">
                  <Calendar size={16} className="label-icon" />
                  Start Date (From)
                </label>
                <input
                  type="date"
                  value={tempFilters.startDate}
                  onChange={(e) => setTempFilters({ ...tempFilters, startDate: e.target.value })}
                  className="filter-input"
                />
              </div>

              <div className="filter-item">
                <label className="filter-label">
                  <Calendar size={16} className="label-icon" />
                  End Date (To)
                </label>
                <input
                  type="date"
                  value={tempFilters.endDate}
                  onChange={(e) => setTempFilters({ ...tempFilters, endDate: e.target.value })}
                  className="filter-input"
                />
              </div>

              <div className="filter-item">
                <label className="filter-label">Published Within</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="publishedTimeRange"
                      value="24hours"
                      checked={tempFilters.publishedTimeRange === '24hours'}
                      onChange={(e) => setTempFilters({ ...tempFilters, publishedTimeRange: e.target.value })}
                      className="filter-checkbox"
                    />
                    <span>Last 24 hours</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="publishedTimeRange"
                      value="1week"
                      checked={tempFilters.publishedTimeRange === '1week'}
                      onChange={(e) => setTempFilters({ ...tempFilters, publishedTimeRange: e.target.value })}
                      className="filter-checkbox"
                    />
                    <span>Last 1 week</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="publishedTimeRange"
                      value="1month"
                      checked={tempFilters.publishedTimeRange === '1month'}
                      onChange={(e) => setTempFilters({ ...tempFilters, publishedTimeRange: e.target.value })}
                      className="filter-checkbox"
                    />
                    <span>Last 1 month</span>
                  </label>
                  {tempFilters.publishedTimeRange && (
                    <button
                      onClick={() => setTempFilters({ ...tempFilters, publishedTimeRange: '' })}
                      className="clear-filters-btn"
                      style={{ marginTop: '4px', fontSize: '12px', padding: '6px 12px' }}
                    >
                      <X size={14} />
                      Clear Selection
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="filters-actions">
              <button onClick={clearFilters} className="clear-filters-btn">
                <X size={16} />
                Clear All
              </button>
              <button onClick={applyFilters} className="apply-filters-btn">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Projects Table */}
      <div className="table-card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => sortData('description')}>
                  <div className="th-content">
                    Project Details
                    <SortIcon columnKey="description" />
                  </div>
                </th>
                <th onClick={() => sortData('startDate')}>
                  <div className="th-content">
                    Timeline
                    <SortIcon columnKey="startDate" />
                  </div>
                </th>
                <th onClick={() => sortData('requiredEmployees')}>
                  <div className="th-content">
                    Team Requirements
                    <SortIcon columnKey="requiredEmployees" />
                  </div>
                </th>
                <th onClick={() => sortData('location')}>
                  <div className="th-content">
                    Location & Actions
                    <SortIcon columnKey="location" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProjects.length > 0 ? (
                currentProjects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div className="project-details">
                        <h3 className="project-title">{project.description}</h3>
                        <p className="project-desc">{project.taskDescription}</p>
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
                        <div className="employee-count">👥 {project.requiredEmployees} employees</div>
                        <div className="roles-section">
                          <p className="roles-label">Roles:</p>
                          <div className="roles-container">
                            {project.rolesWithCapacity && project.rolesWithCapacity.length > 0 ? (
                              project.rolesWithCapacity.map((roleInfo, idx) => (
                                <span key={idx} className="role-badge">
                                  {roleInfo.role}
                                </span>
                              ))
                            ) : null}
                          </div>
                          <div className="capacity">
                            ⏱️ {project.rolesWithCapacity && project.rolesWithCapacity.length > 0
                              ? project.rolesWithCapacity.map((roleInfo, idx) =>
                                `${roleInfo.role.split(' ')[0]}: ${roleInfo.capacity}`
                              ).join(', ')
                              : 'Not specified'} Hours/Week
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="location-container">
                        <div className="location">📍 {project.location}</div>
                        <button
                          onClick={() => handleApplyProject(project.id)}
                          className="btn-apply"
                        >
                          Apply
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-results">
                    <div className="no-results-content">
                      <div className="no-results-icon">🔍</div>
                      <p className="no-results-title">No projects found</p>
                      <p className="no-results-text">Try adjusting your search or filter criteria</p>
                      <button onClick={clearFilters} className="clear-filters-btn">
                        <X size={16} />
                        Clear All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {sortedProjects.length > 0 && (
        <div className="footer">
          <span className="footer-text">
            Showing <strong>{startIndex + 1}-{Math.min(endIndex, sortedProjects.length)}</strong> of{' '}
            <strong>{sortedProjects.length}</strong> projects
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
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  className={`pagination-number ${currentPage === page ? 'active' : ''}`}
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
      )}
    </div>
  );
}