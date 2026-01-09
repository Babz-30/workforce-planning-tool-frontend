const API_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

/**
 * Fetch published projects from the API
 * @param {boolean} isPublished - Flag to filter published projects (true/false)
 * @returns {Promise<Array>} - Array of published projects with roles expanded
 */
export const getPublishedProjects = async (isPublished = true) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/projects/published/${isPublished}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Transform and expand projects by roles
    const transformedProjects = transformProjectsWithRoles(data.data);

    return transformedProjects;

  } catch (error) {
    console.error("Error fetching published projects:", error);
    throw error;
  }
};

/**
 * Transform API response and create separate entries for each role
 * @param {Array} apiProjects - Raw projects from API
 * @returns {Array} - Transformed projects with one entry per role
 */
const transformProjectsWithRoles = (apiProjects) => {
  if (!Array.isArray(apiProjects)) {
    console.error("Expected array of projects, got:", apiProjects);
    return [];
  }

  const expandedProjects = [];

  apiProjects.forEach((project) => {
    // If project has roles, create separate entry for each role
    if (project.roles && project.roles.length > 0) {
      project.roles.forEach((role, roleIndex) => {
        const location =
          project.selectedLocations && project.selectedLocations.length > 0
            ? project.selectedLocations.join(" / ")
            : "Remote";

        expandedProjects.push({
          id: `${project.id || project.projectId}_role_${roleIndex}`,
          projectId: project.projectId,
          originalProjectId: project.id,
          description: project.projectDescription,
          taskDescription: project.taskDescription,
          startDate: project.projectStart || "",
          endDate: project.projectEnd || "",
          
          // Role-specific information
          requiredRole: role.requiredRole,
          roleCompetencies: role.requiredCompetencies || [],
          roleCapacity: role.capacity,
          roleNumberOfEmployees: role.numberOfEmployees,
          
          // Combined competencies (role + project skills)
          competencies: [
            ...new Set([
              ...(role.requiredCompetencies || []),
              ...(project.selectedSkills || [])
            ])
          ],
          
          // Project-level information
          requiredEmployees: project.requiredEmployees,
          allRoles: project.roles.map(r => r.requiredRole),
          location: location,
          locations: project.selectedLocations || [],
          skills: project.selectedSkills || [],
          isPublished: project.isPublished,
          publishedDate: project.createdAt || "",
          status: project.status,
          createdBy: project.createdBy,
          links: project.links,
          
          // Full role details for reference
          roleDetails: role,
          allRolesDetails: project.roles,
        });
      });
    } else {
      // If no roles, create single entry with project info
      const location =
        project.selectedLocations && project.selectedLocations.length > 0
          ? project.selectedLocations.join(" / ")
          : "Remote";

      expandedProjects.push({
        id: project.id || project.projectId,
        projectId: project.projectId,
        description: project.projectDescription,
        taskDescription: project.taskDescription,
        startDate: project.projectStart || "",
        endDate: project.projectEnd || "",
        requiredEmployees: project.requiredEmployees,
        requiredRole: "Not specified",
        roleCompetencies: [],
        roleCapacity: "Not specified",
        roleNumberOfEmployees: 0,
        competencies: project.selectedSkills || [],
        allRoles: [],
        location: location,
        locations: project.selectedLocations || [],
        skills: project.selectedSkills || [],
        isPublished: project.isPublished,
        publishedDate: project.createdAt || "",
        status: project.status,
        createdBy: project.createdBy,
        links: project.links,
        allRolesDetails: [],
      });
    }
  });

  return expandedProjects;
};

/**
 * Filter projects based on search and filter criteria
 * @param {Array} projects - Array of projects to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered projects
 */
export const filterProjects = (projects, filters) => {
  let filtered = projects;

  // Search query filter
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (project) =>
        project.description.toLowerCase().includes(query) ||
        project.taskDescription.toLowerCase().includes(query) ||
        project.competencies.some((comp) =>
          comp.toLowerCase().includes(query)
        ) ||
        project.requiredRole.toLowerCase().includes(query)
    );
  }

  // Role filter
  if (filters.role) {
    filtered = filtered.filter((project) =>
      project.requiredRole.toLowerCase().includes(filters.role.toLowerCase())
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
    filtered = filtered.filter((project) =>
      isPublishedInTimeRange(project.publishedDate, filters.publishedTimeRange)
    );
  }

  // Date range filter
  if (filters.startDate || filters.endDate) {
    filtered = filtered.filter((project) =>
      isWithinDateRange(
        project.startDate,
        project.endDate,
        filters.startDate,
        filters.endDate
      )
    );
  }

  return filtered;
};

/**
 * Check if project was published within the specified time range
 * @param {string} publishedDate - Project published date
 * @param {string} timeRange - Time range (24hours, 1week, 1month)
 * @returns {boolean}
 */
const isPublishedInTimeRange = (publishedDate, timeRange) => {
  if (!publishedDate) return false;

  const projectDate = new Date(publishedDate);
  const today = new Date();
  const diffTime = Math.abs(today - projectDate);
  const diffHours = diffTime / (1000 * 60 * 60);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  switch (timeRange) {
    case "24hours":
      return diffHours <= 24;
    case "1week":
      return diffDays <= 7;
    case "1month":
      return diffDays <= 30;
    default:
      return true;
  }
};

/**
 * Check if project dates fall within the filter date range
 * @param {string} projectStartDate - Project start date
 * @param {string} projectEndDate - Project end date
 * @param {string} filterStartDate - Filter start date
 * @param {string} filterEndDate - Filter end date
 * @returns {boolean}
 */
const isWithinDateRange = (
  projectStartDate,
  projectEndDate,
  filterStartDate,
  filterEndDate
) => {
  if (!filterStartDate && !filterEndDate) return true;

  const projStart = new Date(projectStartDate);
  const projEnd = new Date(projectEndDate);

  if (filterStartDate && !filterEndDate) {
    const filterStart = new Date(filterStartDate);
    return projStart >= filterStart;
  }

  if (!filterStartDate && filterEndDate) {
    const filterEnd = new Date(filterEndDate);
    return projEnd <= filterEnd;
  }

  if (filterStartDate && filterEndDate) {
    const filterStart = new Date(filterStartDate);
    const filterEnd = new Date(filterEndDate);
    return projStart >= filterStart && projEnd <= filterEnd;
  }

  return true;
};

/**
 * Sort projects based on sort configuration
 * @param {Array} projects - Array of projects to sort
 * @param {Object} sortConfig - Sort configuration {key, direction}
 * @returns {Array} - Sorted projects
 */
export const sortProjects = (projects, sortConfig) => {
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

/**
 * Apply for a project with specific role
 * @param {string} employeeId - Employee ID applying
 * @param {string} projectId - Project ID to apply for
 * @param {string} projectRole - Specific role being applied for
 * @param {Object} additionalData - Additional application data
 * @returns {Promise<Object>} - Response from API
 */
export const applyForProject = async (employeeId, projectId, projectRole, additionalData = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/applications/apply/applyToOpenProject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId: employeeId,
        projectId: projectId,
        projectRole: projectRole
      }),
    });

    if (!response.ok) {
      if(response.status === 409){
        return await response.json();
      }
      else { 
        throw new Error(`HTTP error! status: ${response.status}`);
      }     
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error applying for project:", error);
    throw error;
  }
};

/**
 * Get project details by ID
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} - Project details
 */
export const getProjectById = async (projectId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/getproject/${projectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return transformProjectsWithRoles([data]);
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
};