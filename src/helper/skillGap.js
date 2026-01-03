// Step 1: Collect available skills from employees
function getAvailableSkills(employees) {
  const skillCount = {};

  employees.forEach((emp) => {
    (emp.skills || []).forEach((skill) => {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
  });

  return skillCount;
}

// Step 2: Collect required skills from projects
function getRequiredSkills(projects) {
  const requiredSkills = {};

  projects.forEach((project) => {
    (project.roles || []).forEach((role) => {
      const count = Number(role.numberOfEmployees || 1);

      (role.requiredCompetencies || []).forEach((skill) => {
        requiredSkills[skill] = (requiredSkills[skill] || 0) + count;
      });
    });
  });

  return requiredSkills;
}

// Step 3: Skill gap analysis
export function calculateSkillGaps(employees, projects) {
  const availableSkills = getAvailableSkills(employees);
  const requiredSkills = getRequiredSkills(projects);

  const skillGaps = [];

  Object.keys(requiredSkills).forEach((skill) => {
    const required = requiredSkills[skill];
    const available = availableSkills[skill] || 0;
    const gap = Math.max(required - available, 0);

    if (gap > 0) {
      skillGaps.push({
        skill,
        required,
        available,
        gap,
      });
    }
  });

  return skillGaps;
}
