/**
 * API Service for Assigned Projects
 * Handles all API calls related to assigned projects for employees
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL

/**
 * Get all assigned projects for a specific employee
 * @param {number} employeeId - The ID of the employee
 * @returns {Promise<Array>} Array of assigned project applications
 */
export const getAssignedProjects = async (employeeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/applications/suggested-projects/${employeeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching assigned projects:", error)
    throw error
  }
}
