import axios from "axios";
import ApiEndPoints from "../../constant/ApiEndpoint";
function mapToPayload(Comments) {
  return {
    projectManagerId: String(
      JSON.parse(localStorage.getItem("loginResponse")).employeeId || "admin",
    ),
  };
}
// Update URL to your backend endpoint
export async function triggerExternalSearch(projectId) {
  let mappedPayload = mapToPayload("Triggering external search");
  let response = await axios.post(
    localStorage.getItem("Base_URL") +
      ApiEndPoints.trigger_External_Search.replace("{projectId}", projectId),
    mappedPayload,
  );
  return response.status;
}
