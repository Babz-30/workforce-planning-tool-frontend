export default function getAppliedEmployees(applications) {
  console.log("Applications in DuplicateEmployeeBinder:", applications);
  return applications.reduce((acc, item) => {
    const { projectId, employeeId } = item;

    if (!acc[projectId]) {
      acc[projectId] = [];
    }

    // avoid duplicates
    if (!acc[projectId].includes(employeeId)) {
      acc[projectId].push(employeeId);
    }

    console.log(acc);
    return acc;
  }, {});
}
