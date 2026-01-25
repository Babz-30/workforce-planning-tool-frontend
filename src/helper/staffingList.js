export function buildProjectTeamTimeline({
  projectJson,
  applicationByProjectId,
  employeeList,
}) {
  // ✅ Accept both shapes:
  // 1) projectJson is an array: [...]
  // 2) projectJson is an object with .data: { data: [...] }
  const projects = Array.isArray(projectJson)
    ? projectJson
    : (projectJson?.data ?? []);

  // ✅ If still empty, log why and return []
  if (!Array.isArray(projects) || projects.length === 0) {
    console.warn(
      "buildProjectTeamTimeline: No projects found. Check projectJson shape:",
      projectJson,
    );
    return [];
  }

  const employeesArr = Array.isArray(employeeList) ? employeeList : [];
  const appsByProject =
    applicationByProjectId && typeof applicationByProjectId === "object"
      ? applicationByProjectId
      : {};

  // 1) employeeId -> "First Last"
  const employeeNameById = new Map(
    employeesArr.map((e) => {
      const id = Number(e?.employeeId);
      const first = String(e?.firstName ?? "").trim();
      const last = String(e?.lastName ?? "").trim();
      const fullName =
        `${first} ${last}`.trim() || `Employee ${id || "Unknown"}`;
      return [id, fullName];
    }),
  );

  // 2) Build output
  return projects.map((p) => {
    const projectId = p?.projectId;
    const apps = Array.isArray(appsByProject?.[projectId])
      ? appsByProject[projectId]
      : [];

    const uniqueEmployeeIds = [
      ...new Set(
        apps
          .map((a) => Number(a?.employeeId))
          .filter((id) => Number.isFinite(id)),
      ),
    ];

    const team = uniqueEmployeeIds.map(
      (id) => employeeNameById.get(id) || `Employee ${id}`,
    );

    const assignmentStarts = apps
      .map((a) => a?.employeeProjectStartDate)
      .filter(Boolean);
    const assignmentEnds = apps
      .map((a) => a?.employeeProjectEndDate)
      .filter(Boolean);

    const start =
      p?.projectStart ??
      (assignmentStarts.length ? assignmentStarts.sort()[0] : null);
    const end =
      p?.projectEnd ??
      (assignmentEnds.length ? assignmentEnds.sort().slice(-1)[0] : null);

    return {
      project: projectId,
      description: p?.projectDescription || "",
      team,
      start,
      end,
    };
  });
}
