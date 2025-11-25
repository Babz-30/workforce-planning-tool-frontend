import axios from "axios";

const API_BASE_URL = "https://workforcemangementtool.onrender.com";

// Actual API call to update employee
export const updateEmployeeById = async (employeeId, employeeData) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/api/employees/${employeeId}`,
            employeeData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;

    } catch (error) {
        console.error("Update Employee API Error:", error);
        throw error;
    }
};

// Actual API call to get employee by ID
export const getEmployeeById = async (employeeId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/employees/${employeeId}`
        );

        return response.data;

    } catch (error) {
        console.error("Get Employee API Error:", error);
        throw error;
    }
};
