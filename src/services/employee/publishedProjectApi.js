const API_BASE_URL = localStorage.getItem("Base_URL");

/**
 * Fetch published projects from the API
 * @param {boolean} isPublished - Flag to filter published projects (true/false)
 * @returns {Promise<Array>} - Array of published projects
 */
export const getPublishedProjects = async (isPublished = true) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/projects/published/${isPublished}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const transformedProjects = transformProjects(data.data);

    return transformedProjects;
  } catch (error) {
    console.error("Error fetching published projects:", error);
    throw error;
  }
};

/**
 * Transform API response to match component's expected format
 * @param {Array} apiProjects - Raw projects from API
 * @returns {Array} - Transformed projects
 */
const transformProjects = (apiProjects) => {
  if (!Array.isArray(apiProjects)) {
    console.error("Expected array of projects, got:", apiProjects);
    return [];
  }

  return apiProjects.map((project) => {
    // Extract all unique competencies from roles
    const competencies = project.roles
      ? [
        ...new Set(
          project.roles.flatMap((role) => role.requiredCompetencies || [])
        ),
      ]
      : [];

    // Extract all role names
    const roles = project.roles
      ? project.roles.map((role) => role.requiredRole)
      : [];

    // Keep role-specific capacity information
    const rolesWithCapacity = project.roles
      ? project.roles.map((role) => ({
        role: role.requiredRole,
        competencies: role.requiredCompetencies,
        capacity: role.capacity,
        numberOfEmployees: role.numberOfEmployees,
      }))
      : [];

    // Get primary location (first location in array)
    const location =
      project.selectedLocations && project.selectedLocations.length > 0
        ? project.selectedLocations.join("  / ")
        : "Remote";

    return {
      id: project._id?.$oid || project.projectId,
      projectId: project.projectId,
      description: project.projectDescription,
      taskDescription: project.taskDescription,
      startDate: project.projectStart || "",
      endDate: project.projectEnd || "",
      requiredEmployees: project.requiredEmployees,
      roles: roles,
      competencies: [...new Set([...competencies, ...(project.selectedSkills || [])])], // Combine role competencies and selected skills
      rolesWithCapacity: rolesWithCapacity,
      location: location,
      locations: project.selectedLocations || [],
      skills: project.selectedSkills || [],
      isPublished: project.isPublished,
      publishedDate: project.createdAt || "",
      status: project.status,
      createdBy: project.createdBy,
      links: project.links,
      // Keep original roles data for detailed view
      rolesDetails: project.roles,
    };
  });
};

/**
 * Filter projects based on search and filter criteria
 * This is a client-side filtering function since the API doesn't support these filters
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
        project.roles.some((role) => role.toLowerCase().includes(query))
    );
  }

  // Role filter
  if (filters.role) {
    filtered = filtered.filter((project) =>
      project.roles.some((role) =>
        role.toLowerCase().includes(filters.role.toLowerCase())
      )
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
 * Apply for a project
 * @param {string} projectId - Project ID to apply for
 * @param {Object} applicationData - Application data
 * @returns {Promise<Object>} - Response from API
 */
export const applyForProject = async (projectId, applicationData = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/apply-project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if needed
        // "Authorization": `Bearer ${localStorage.getItem("authToken")}`
      },
      body: JSON.stringify({
        projectId: projectId,
        ...applicationData,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
    return transformProjects([data])[0];
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
};