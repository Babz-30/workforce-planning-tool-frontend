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
      description: project.description,
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
