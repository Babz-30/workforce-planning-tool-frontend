import axios from "axios";
import ApiEndPoints from "../../constant/ApiEndpoint";
function mapToPayload(Comments) {
  return {
    comments: Comments,
    projectManagerId: String(
      JSON.parse(localStorage.getItem("loginResponse")).employeeId || "admin"
    ),
  };
}

export async function requestDhApproval(applicationID) {
  let mappedPayload = mapToPayload("Approved by PM");
  console.log("Posting project with payload:", mappedPayload);
  try {
    const response = await axios.put(
      localStorage.getItem("Base_URL") +
        ApiEndPoints.Deparment_Header_Approval_And_Reject +
        applicationID +
        "/request-dh-approval",
      mappedPayload
    );
    console.log("Success:", response.data);
    return response;
  } catch (error) {
    console.error("Error:", error.response);
    return error.response;
  }
}
export async function rejectApplication(applicationID, reason) {
  let mappedPayload = mapToPayload(reason);
  try {
    const response = await axios.post(
      localStorage.getItem("Base_URL") +
        ApiEndPoints.Deparment_Header_Approval_And_Reject +
        applicationID +
        "/reject",
      mappedPayload
    );
    console.log("Success:", response.data);
    return response;
  } catch (error) {
    console.error("Error:", error.response);
    return error.response;
  }
}
