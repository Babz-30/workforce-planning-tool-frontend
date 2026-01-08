/**
 * API Service for Suggestions/Applications
 * Handles all API calls related to suggested projects for employees
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

/**
 * Get all suggested projects for a specific employee
 * @param {number} employeeId - The ID of the employee
 * @returns {Promise<Array>} Array of suggested project applications
 */
export const getSuggestedProjects = async (employeeId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/applications/suggested-projects/${employeeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching suggested projects:', error);
        throw error;
    }
};

/**
 * Accept a suggested project
 * @param {string} applicationId - The ID of the application
 * @param {number} employeeId - The ID of the employee
 * @returns {Promise<Object>} Updated application object
 */
export const acceptSuggestion = async (applicationId, employeeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/applications/apply/suggestedProjects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        applicationId: applicationId,
        employeeId: employeeId
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error accepting suggestion:', error);
    throw error;
  }
};
