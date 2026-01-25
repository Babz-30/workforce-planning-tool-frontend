export function buildProjectTeamTimeline({
  projectJson,
  applicationByProjectId,
  employeeList,
}) {
  console.log("---------------------------", projectJson);
  console.log("---------------------------", applicationByProjectId);
  console.log("---------------------------", employeeList);

  // 1) Build a fast lookup: employeeId -> "First Last"
  const employeeNameById = new Map(
    (employeeList || []).map((e) => {
      const first = (e?.firstName || "").trim();
      const last = (e?.lastName || "").trim();
      const fullName = `${first} ${last}`.trim() || `Employee ${e?.employeeId}`;
      return [Number(e?.employeeId), fullName];
    }),
  );

  // 2) Iterate all projects and attach team members from applications
  const projects = projectJson?.data || [];

  return projects.map((p) => {
    const projectId = p?.projectId;
    const apps = applicationByProjectId?.[projectId] || [];

    // collect unique employeeIds from applications
    const uniqueEmployeeIds = [
      ...new Set(apps.map((a) => Number(a?.employeeId)).filter(Boolean)),
    ];

    // map employeeIds -> full names
    const team = uniqueEmployeeIds.map(
      (id) => employeeNameById.get(id) || `Employee ${id}`,
    );

    // (optional) if project start/end missing, fallback to min/max from assignments
    const assignmentStarts = apps
      .map((a) => a?.employeeProjectStartDate)
      .filter(Boolean);
    const assignmentEnds = apps
      .map((a) => a?.employeeProjectEndDate)
      .filter(Boolean);

    const start =
      p?.projectStart ||
      (assignmentStarts.length ? assignmentStarts.sort()[0] : null);
    const end =
      p?.projectEnd ||
      (assignmentEnds.length ? assignmentEnds.sort().slice(-1)[0] : null);
    console.log("buildProjectTeamTimeline output record:", {
      project: projectId,
      description: p?.projectDescription || "",
    });
    return {
      project: projectId, // keeping your requested "project" field
      description: p?.projectDescription || "", // from project.json
      team, // ["First Last", ...]
      start, // YYYY-MM-DD
      end, // YYYY-MM-DD
    };
  });
}
