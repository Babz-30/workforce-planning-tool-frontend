import axios from "axios";
import ApiEndPoints from "../../constant/ApiEndpoint";
function mapToPayload(projectId, projectRole, employeeId) {
  return {
    projectId: String(projectId),
    projectRole: projectRole,
    employeeId: employeeId,
    plannerUserId: String(
      JSON.parse(localStorage.getItem("loginResponse")).username || "admin"
    ),
  };
}

export async function ProposeProject(projectId, projectRole, employeeId) {
  let mappedPayload = mapToPayload(projectId, projectRole, employeeId);
  console.log("Posting project with payload:", mappedPayload);
  try {
    const response = await axios.post(
      localStorage.getItem("Base_URL") + ApiEndPoints.Propose_Project,
      mappedPayload
    );
    console.log("Success:", response.data);
    return response;
  } catch (error) {
    console.error("Error:", error.response);
    return error.response;
  }
}
