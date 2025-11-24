import axios from "axios";
import ApiEndPoints from "../../constant/ApiEndpoint";

export async function publishProject(projectId) {
  try {
    let response = await axios.patch(
      localStorage.getItem("Base_URL") +
        ApiEndPoints.Publish_Project.replace("{projectId}", projectId)
    );

    return response.status;
  } catch (error) {
    console.error(
      "Error publishing project:",
      error.response?.data || error.message
    );
    return error.response?.status || 500;
  }
}
