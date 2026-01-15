import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || localStorage.getItem("Base_URL");

// Helper to transform backend employee data to frontend format for display
const transformEmployeeToFrontend = (backendEmployee) => {
    // Determine the role/position to display
    let displayRole = backendEmployee.position;
    
    // If position is empty, use the most recent work experience role
    if (!displayRole && backendEmployee.workExperience && backendEmployee.workExperience.length > 0) {
        // Sort by start date descending to get most recent
        const sortedExperience = [...backendEmployee.workExperience].sort((a, b) => {
            if (!a.startDate) return 1;
            if (!b.startDate) return -1;
            return new Date(b.startDate) - new Date(a.startDate);
        });
        displayRole = sortedExperience[0].role;
    }

    return {
        id: backendEmployee.employeeId,
        name: `${backendEmployee.firstName} ${backendEmployee.lastName}`,
        email: backendEmployee.email,
        role: displayRole || "Not Specified",
        location: backendEmployee.baseLocation || "Not Specified",
        capacity: backendEmployee.capacity || 0,
        skills: backendEmployee.skills || [],
        currentProject: backendEmployee.assignedProjectId || null,
        availability: backendEmployee.availabilityStatus || "AVAILABLE"
    };
};

// Fetch all employees filtered by department
export const getDepartmentEmployees = async () => {
    try {
        // Get logged in user's department from localStorage
        const loginResponse = JSON.parse(localStorage.getItem("loginResponse"));
        
        if (!loginResponse || !loginResponse.department) {
            throw new Error("Department information not found in login response");
        }

        const userDepartment = loginResponse.department;

        // Fetch all employees
        const employeesResponse = await axios.get(`${API_BASE_URL}/api/employees`);
        
        // Fetch all published projects to check which project IDs exist
        const projectsResponse = await axios.get(`${API_BASE_URL}/api/projects/published/true`);
        const projects = projectsResponse.data.data || projectsResponse.data;
        
        // Create a set of valid project IDs for quick lookup
        const validProjectIds = new Set(projects.map(project => project.projectId));

        // Filter employees by department and exclude those with valid assigned projects
        const departmentEmployees = employeesResponse.data.filter(employee => {
            // Must be in the same department
            if (employee.department !== userDepartment) {
                return false;
            }
            
            // Must have role EMPLOYEE
            if (employee.role !== "EMPLOYEE") {
                return false;
            }
            
            // Include if no assigned project
            if (!employee.assignedProjectId || employee.assignedProjectId.trim() === "") {
                return true;
            }
            
            // Include only if assigned project ID is NOT in the published projects list
            return validProjectIds.has(employee.assignedProjectId);
        });

        // Transform to frontend format
        const transformedEmployees = departmentEmployees.map(transformEmployeeToFrontend);

        return { data: transformedEmployees };

    } catch (error) {
        console.error("Get Department Employees API Error:", error);
        throw error;
    }
};

// Fetch single employee details (if needed in future)
export const getEmployeeDetails = async (employeeId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/employees/${employeeId}`);
        const transformedData = transformEmployeeToFrontend(response.data);
        return { data: transformedData };
    } catch (error) {
        console.error("Get Employee Details API Error:", error);
        throw error;
    }
};

// Helper to transform resource data (employee + project) to frontend format
const transformResourceToFrontend = (employee, project) => {
    // Extract required roles from project
    const requiredRoles = project.roles?.map(role => role.requiredRole) || [];
    
    return {
        id: employee.employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        employeeEmail: employee.email,
        role: employee.position || "Not Specified",
        employeeSkills: employee.skills || [],
        location: employee.baseLocation || "Not Specified",
        capacity: employee.capacity || 0,
        projectName: project.projectId,
        projectDescription: project.projectDescription || "No description available",
        projectStatus: project.status || "ACTIVE",
        startDate: project.projectStart,
        endDate: project.projectEnd,
        requiredSkills: project.selectedSkills || [],
        teamSize: project.requiredEmployees || 0,
        requiredRoles: requiredRoles,
        estimatedWorkload: employee.capacity || 0,
        taskDescription: project.taskDescription || ""
    };
};

// Fetch department resources (employees with assigned projects)
export const getDepartmentResources = async () => {
    try {
        // Get logged in user's department from localStorage
        const loginResponse = JSON.parse(localStorage.getItem("loginResponse"));
        
        if (!loginResponse || !loginResponse.department) {
            throw new Error("Department information not found in login response");
        }

        const userDepartment = loginResponse.department;

        // Fetch all employees
        const employeesResponse = await axios.get(`${API_BASE_URL}/api/employees`);
        
        // Filter employees who:
        // 1. Belong to the same department
        // 2. Have role EMPLOYEE
        // 3. Have an assigned project (assignedProjectId is not null/empty)
        // 4. Are NOT_AVAILABLE or PARTIALLY_AVAILABLE (actively working on projects)
        const assignedEmployees = employeesResponse.data.filter(
            employee => 
                employee.department === userDepartment &&
                employee.role === "EMPLOYEE" &&
                employee.assignedProjectId &&
                employee.assignedProjectId.trim() !== "" &&
                (employee.availabilityStatus === "NOT_AVAILABLE" || 
                 employee.availabilityStatus === "PARTIALLY_AVAILABLE")
        );

        // Fetch all published projects
        const projectsResponse = await axios.get(`${API_BASE_URL}/api/projects/published/true`);
        const projects = projectsResponse.data.data || projectsResponse.data;

        // Create a map of projectId to project details for quick lookup
        const projectsMap = {};
        projects.forEach(project => {
            projectsMap[project.projectId] = project;
        });

        // Combine employee and project data
        const resources = assignedEmployees
            .map(employee => {
                const project = projectsMap[employee.assignedProjectId];
                
                // Only include if we found the project details
                if (project) {
                    return transformResourceToFrontend(employee, project);
                }
                return null;
            })
            .filter(resource => resource !== null); // Remove null entries

        return { data: resources };

    } catch (error) {
        console.error("Get Department Resources API Error:", error);
        throw error;
    }
};

// Helper to transform application data to frontend format for project requests
const transformApplicationToFrontend = (application, employee, project) => {
    // Get the role details from project that matches the application's projectRole
    const matchingRole = project.roles?.find(role => role.requiredRole === application.projectRole);
    
    // Combine employee skills and interests
    const employeeSkills = [
        ...(employee.skills || []),
        ...(employee.interests || [])
    ];

    // Combine project selectedSkills with requiredCompetencies from matching role
    const allRequiredSkills = [
        ...(project.selectedSkills || []),
        ...(matchingRole?.requiredCompetencies || [])
    ];
    
    // Remove duplicates
    const uniqueRequiredSkills = [...new Set(allRequiredSkills)];

    // Get requested by from approvedByProjectManager
    const requestedBy = application.approvedByProjectManager?.userName || "N/A";

    const requestedByRole = application.approvedByProjectManager?.role || "N/A";
    
    // Get requested date from timestamps.approvedAt
    const requestedDate = application.timestamps?.approvedAt || application.timestamps?.suggestedAt || new Date().toISOString();

    return {
        id: application.applicationId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        employeeRole: application.projectRole,
        employeeSkills: employeeSkills,
        projectName: project.projectId,
        projectDescription: project.projectDescription || "No description available",
        taskDescription: project.taskDescription || "",
        requestedBy: requestedBy,
        requestedByRole: requestedByRole,
        requestedDate: requestedDate,
        projectStartDate: project.projectStart,
        projectEndDate: project.projectEnd,
        requiredSkills: uniqueRequiredSkills,
        location: project.selectedLocations?.[0] || "Not specified",
        teamSize: project.requiredEmployees || 0,
        requiredRoles: project.roles?.map(role => role.requiredRole) || [],
        estimatedWorkload: matchingRole?.capacity ? parseInt(matchingRole.capacity) : employee.capacity || 0,
        status: application.currentStatus === "REQUEST_DH_APPROVAL" ? "pending" :
                application.currentStatus === "REJECTED_BY_DH" ? "rejected" :
                application.currentStatus === "COMPLETED" ? "approved" : "pending",
        applicationId: application.applicationId,
        employeeId: employee.employeeId
    };
};

// Fetch department project requests
export const getDepartmentProjectRequests = async () => {
    try {
        // Get logged in user's department from localStorage
        const loginResponse = JSON.parse(localStorage.getItem("loginResponse"));
        
        if (!loginResponse || !loginResponse.department) {
            throw new Error("Department information not found in login response");
        }

        const userDepartment = loginResponse.department;

        // Fetch all applications
        const applicationsResponse = await axios.get(`${API_BASE_URL}/api/applications/all`);
        
        // Filter applications by status: REQUEST_DH_APPROVAL, REJECTED_BY_DH, COMPLETED
        const relevantApplications = applicationsResponse.data.filter(
            app => app.currentStatus === "REQUEST_DH_APPROVAL" ||
                   app.currentStatus === "REJECTED_BY_DH" ||
                   app.currentStatus === "COMPLETED"
        );

        // Fetch all employees
        const employeesResponse = await axios.get(`${API_BASE_URL}/api/employees`);
        const employees = employeesResponse.data;

        // Fetch all published projects
        const projectsResponse = await axios.get(`${API_BASE_URL}/api/projects/published/true`);
        const projects = projectsResponse.data.data || projectsResponse.data;

        // Create maps for quick lookup
        const employeesMap = {};
        employees.forEach(emp => {
            employeesMap[emp.employeeId] = emp;
        });

        const projectsMap = {};
        projects.forEach(proj => {
            projectsMap[proj.projectId] = proj;
        });

        // Combine application, employee, and project data
        const requests = relevantApplications
            .map(application => {
                const employee = employeesMap[application.employeeId];
                const project = projectsMap[application.projectId];

                // Only include if employee is from the same department and we have all data
                if (employee && project && employee.department === userDepartment && employee.role === "EMPLOYEE") {
                    return transformApplicationToFrontend(application, employee, project);
                }
                return null;
            })
            .filter(request => request !== null); // Remove null entries

        return { data: requests };

    } catch (error) {
        console.error("Get Department Project Requests API Error:", error);
        throw error;
    }
};

// Approve project request
export const approveProjectRequest = async (applicationId, comments = "Approved") => {
    try {
        const loginResponse = JSON.parse(localStorage.getItem("loginResponse"));
        
        if (!loginResponse || !loginResponse.employeeId) {
            throw new Error("Department Head information not found in login response");
        }

        const departmentHeadId = loginResponse.employeeId;

        const response = await axios.put(
            `${API_BASE_URL}/api/department-head/applications/${applicationId}/approve`,
            {
                departmentHeadId: departmentHeadId,
                comments: comments
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return { data: response.data };

    } catch (error) {
        console.error("Approve Project Request API Error:", error);
        throw error;
    }
};

// Reject project request
export const rejectProjectRequest = async (applicationId, rejectionReason = "Rejected by Department Head") => {
    try {
        const loginResponse = JSON.parse(localStorage.getItem("loginResponse"));
        
        if (!loginResponse || !loginResponse.employeeId) {
            throw new Error("Department Head information not found in login response");
        }

        const departmentHeadId = loginResponse.employeeId;

        const response = await axios.put(
            `${API_BASE_URL}/api/department-head/applications/${applicationId}/reject`,
            {
                departmentHeadId: departmentHeadId,
                rejectionReason: rejectionReason
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return { data: response.data };

    } catch (error) {
        console.error("Reject Project Request API Error:", error);
        throw error;
    }
};