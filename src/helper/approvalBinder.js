export function keepPublishedProjects(projectData) {
  return projectData.filter((project) => project.isPublished === true);
}

export function keepOnlyExistingProjects(applicationsByProject, validProjects) {
  // Extract valid projectIds from the projects list
  const validProjectIds = new Set(validProjects.map((project) => project.id));

  // Filter the applications object
  return Object.keys(applicationsByProject).reduce((acc, projectId) => {
    if (validProjectIds.has(projectId)) {
      acc[projectId] = applicationsByProject[projectId];
    }
    return acc;
  }, {});
}
