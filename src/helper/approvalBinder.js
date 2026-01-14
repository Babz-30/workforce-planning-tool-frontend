export function keepPublishedProjects(response) {
  return {
    ...response,
    data: response.data.filter((project) => project.isPublished === true),
  };
}

export function keepOnlyExistingProjects(applicationsByProject, validProjects) {
  // Extract valid projectIds from the projects list
  const validProjectIds = new Set(
    validProjects.map((project) => project.projectId)
  );

  // Filter the applications object
  return Object.keys(applicationsByProject).reduce((acc, projectId) => {
    if (validProjectIds.has(projectId)) {
      acc[projectId] = applicationsByProject[projectId];
    }
    return acc;
  }, {});
}
