export function convertProjectsList(projectsList) {
  return projectsList.map((project) => {
    // Calculate total required employees
    const requiredEmployees = project.roles.reduce((total, role) => {
      return total + parseInt(role.numberOfEmployees || 0);
    }, 0);

    // Extract unique roles (filter out undefined/null values)
    const roles = project.roles
      .map((role) => role.requiredRole)
      .filter((role) => role); // Remove undefined/null

    // Extract unique competencies (flatten and deduplicate)
    const competencies = [
      ...new Set(project.roles.flatMap((role) => project.selectedSkills || [])),
    ];

    // Build capacity string
    const capacity = project.roles
      .filter((role) => role.requiredRole && role.capacity) // Only include roles with both fields
      .map((role) => {
        // Shorten role name (take first word)
        const shortName = role.requiredRole.split(" ")[0];
        return `${shortName}: ${role.capacity}`;
      })
      .join(", ");

    // Convert location array to string
    const location = Array.isArray(project.selectedLocations)
      ? project.selectedLocations.join(" / ")
      : project.selectedLocations || "";

    // Return transformed project object
    return {
      id: project.projectId,
      description: project.projectDescription,
      startDate: project.projectStart,
      endDate: project.projectEnd,
      taskDescription: project.taskDescription,
      requiredEmployees,
      roles,
      competencies,
      capacity,
      location,
      links: project.links,
      isPublished: project.isPublished || false,
    };
  });
}

// Helper function to format availability status
const formatAvailability = (status) => {
  const statusMap = {
    AVAILABLE: "Available",
    PARTIALLY_AVAILABLE: "Partially Available",
    UNAVAILABLE: "Unavailable",
  };
  return statusMap[status] || status;
};

// Transform function
export function transformEmployeesForResourcePlanner(apiData) {
  return apiData.map((employee) => ({
    id: employee.employeeId,
    name: `${employee.firstName} ${employee.lastName}`,
    role: employee.position,
    capacity: employee.capacity,
    skills: employee.skills,
    projects: [], // You'll need to add project data if available
    availability: formatAvailability(employee.availabilityStatus),
  }));
}

export function transformProjectDetails(apiData) {
  console.log("API Data for Project Details:", apiData);
  return apiData.map((project) => ({
    id: project.projectId,
    name: project.projectDescription,
    startDate: project.projectStart,
    endDate: project.projectEnd,
    roles: project.roles.map((role) => ({
      requiredRole: role.requiredRole,
      numberOfEmployees: role.numberOfEmployees,
      capacity: role.capacity,
      requiredCompetencies: role.requiredCompetencies || [],
    })),
  }));
}

// return {
//   id: apiData.projectId,
//   name: apiData.projectDescription,
//   startDate: apiData.projectStart,
//   endDate: apiData.projectEnd,
//   // requiredEmployees: apiData.requiredEmployees,
//   roles: apiData.roles.map((role) => ({
//     requiredRole: role.requiredRole,
//     numberOfEmployees: role.numberOfEmployees,
//     capacity: role.capacity,
//     requiredCompetencies: role.requiredCompetencies || [],
//   })),
//   // competencies: apiData.selectedSkills || [],
//   // capacity: apiData.capacity || "",
//   // location: Array.isArray(apiData.selectedLocations)
//   //   ? apiData.selectedLocations.join(" / ")
//   //   : apiData.selectedLocations || "",
// };
