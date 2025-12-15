export const SKILL_OPTIONS = [
  "Solidity",
  "Ethereum",
  "Web3.js",
  "Node.js",
  "Cryptography",
  "React",
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "MongoDB",
  "PostgreSQL",
  "Figma",
  "REST API",
  "Payment Integration",
];

export const POSITION_OPTIONS = [
  "Blockchain Developer",
  "Smart Contract Engineer",
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "Security Specialist",
  "DevOps Engineer",
  "UI/UX Designer",
  "Project Manager",
  "QA Engineer",
  "Resource Planner",
  "Department Head",
];

export const INTEREST_OPTIONS = [
  "Blockchain",
  "Smart Contracts",
  "Web Development",
  "Mobile Development",
  "Cloud Computing",
  "Database Management",
  "API Development",
  "Security",
  "Testing",
  "Project Management",
  "UI/UX Design",
];

export const LOCATION_OPTIONS = [
  "Remote",
  "Frankfurt",
  "Berlin",
  "Munich",
  "Hamburg",
  "Singapore",
  "London",
  "New York",
  "San Francisco",
  "Tokyo",
  "Hybrid",
];

export const DEPARTMENT_OPTIONS = [
  "Finance",
  "HR",
  "IT",
  "Engineering",
];

export const STATUS_OPTIONS = [
  "AVAILABLE",
  "NOT_AVAILABLE",
];

export const CONTRACT_TYPE_OPTIONS = [
  "FULL_TIME",
  "PART_TIME",
  "TEMPORARY",
  "PERMANENT",
];

// Default hours per week mapping
export const CONTRACT_HOURS_MAP = {
  "FULL_TIME": "40",
  "PART_TIME": "20",
  "TEMPORARY": "",
};

// Initial employee form state
export const INITIAL_EMPLOYEE_STATE = {
  id: "",
  firstName: "",
  lastName: "",
  username:"",
  email: "",
  emergencyContact: "",
  department: "",
  position: "",
  supervisor: "",
  assignedProjectId: "",
  primaryLocation: "",
  selectedSkills: [],
  selectedInterests: [],
  status: "AVAILABLE",
  contractType: "FULL_TIME",
  contractStartDate: "",
  contractEndDate: "",
  hoursPerWeek: "40",
  experiences: [],
};

// Initial experience entry
export const INITIAL_EXPERIENCE = {
  role: "",
  company: "",
  startDate: "",
  endDate: "",
  description: "",
};

/**
 * Normalizes API response to ensure all fields have default values
 * Prevents "uncontrolled to controlled" React warnings
 * @param {Object} apiData - Raw data from API
 * @returns {Object} Normalized employee data with all required fields
 */
export const normalizeEmployeeData = (apiData) => {
  if (!apiData) return { ...INITIAL_EMPLOYEE_STATE };

  return {
    id: apiData.id || "",
    employeeId: apiData.employeeId || "",
    userId: apiData.userId || "",
    username: apiData.username || "",
    firstName: apiData.firstName || "",
    lastName: apiData.lastName || "",
    email: apiData.email || "",
    emergencyContact: apiData.emergencyContact || "",
    department: apiData.department || "",
    position: apiData.position || "",
    supervisor: apiData.supervisor || "",
    assignedProjectId: apiData.assignedProjectId || "",
    primaryLocation: apiData.primaryLocation || "",
    selectedSkills: Array.isArray(apiData.selectedSkills) ? apiData.selectedSkills : [],
    selectedInterests: Array.isArray(apiData.selectedInterests) ? apiData.selectedInterests : [],
    status: apiData.status || "AVAILABLE",
    contractType: apiData.contractType || "FULL_TIME",
    contractStartDate: apiData.contractStartDate || "",
    contractEndDate: apiData.contractEndDate || "",
    capacity: apiData.capacity || "40",
    experiences: Array.isArray(apiData.experiences) 
      ? apiData.experiences.map(exp => normalizeExperience(exp))
      : [],
  };
};

/**
 * Normalizes a single experience entry
 * @param {Object} exp - Raw experience data
 * @returns {Object} Normalized experience with all fields
 */
export const normalizeExperience = (exp) => {
  if (!exp) return { ...INITIAL_EXPERIENCE };

  return {
    role: exp.role || "",
    company: exp.company || "",
    startDate: exp.startDate || "",
    endDate: exp.endDate || "",
    description: exp.description || "",
  };
};