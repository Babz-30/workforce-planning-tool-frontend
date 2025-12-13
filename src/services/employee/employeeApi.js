import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || localStorage.getItem("Base_URL") ;

const employee = JSON.parse(localStorage.getItem("empResponse"));

// Helper to transform frontend data to backend format
const transformToBackendFormat = (formData) => {
    return {
        id: formData.id,
        employeeId: formData.employeeId,
        userId: formData.userId || employee.userId,
        remoteWorking: formData.remoteWorking || false,
        username: formData.username || employee.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        department: formData.department,
        supervisor: formData.supervisor,
        assignedProjectId: formData.assignedProjectId,
        position: formData.position,
        role: formData.role || employee.role,
        message: formData.message || employee.message,
        skills: formData.selectedSkills || [],
        interests: formData.selectedInterests || [],
        baseLocation: formData.primaryLocation || "",
        preferredLocations: formData.preferredLocations || employee.preferredLocations,
        emergencyContact: formData.emergencyContact || "",
        availabilityStatus: formData.status || "AVAILABLE",
        contractType: formData.contractType || "FULL_TIME",
        capacity: parseInt(formData.capacity) || 40,
        workExperience: (formData.experiences || []).map(exp => ({
            role: exp.role || "",
            company: exp.company || "",
            startDate: exp.startDate || null,
            endDate: exp.endDate || null,
            description: exp.description || ""
        }))
    };
};

// Helper to transform backend data to frontend format
const transformToFrontendFormat = (backendData) => {
    return {
        id: backendData.id,
        employeeId: backendData.employeeId,
        userId: backendData.userId,
        remoteWorking: backendData.remoteWorking,
        username: backendData.username,
        firstName: backendData.firstName,
        lastName: backendData.lastName,
        email: backendData.email,
        department: backendData.department,
        supervisor: backendData.supervisor,
        assignedProjectId: backendData.assignedProjectId,
        position: backendData.position,
        role: backendData.role,
        message: backendData.message,
        selectedSkills: backendData.skills || [],
        selectedInterests: backendData.interests || [],
        primaryLocation: backendData.baseLocation || "",
        preferredLocations: backendData.preferredLocations || [],
        emergencyContact: backendData.emergencyContact || "",
        status: backendData.availabilityStatus || "AVAILABLE",
        contractType: backendData.contractType || "FULL_TIME",
        capacity: backendData.capacity || 40,
        experiences: (backendData.workExperience || []).map(exp => ({
            role: exp.role,
            company: exp.company,
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description
        })),
        contractStartDate: "",
        contractEndDate: ""
    };
};

// API call to update employee
export const updateEmployeeById = async (employeeId, employeeData) => {
    try {

        const backendData = transformToBackendFormat(employeeData);
        console.log("Put request", backendData);
        
        const response = await axios.put(
            `${API_BASE_URL}/api/employees/${employeeId}`,
            backendData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return { data: response.data };

    } catch (error) {
        console.error("Update Employee API Error:", error);
        throw error;
    }
};

// API call to get employee by ID
export const getEmployeeById = async (employeeId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/employees/${employeeId}`
        );
        localStorage.setItem("empResponse", JSON.stringify(response.data));
        const transformedData = transformToFrontendFormat(response.data);
        return { data: transformedData };

    } catch (error) {
        console.error("Get Employee API Error:", error);
        throw error;
    }
};