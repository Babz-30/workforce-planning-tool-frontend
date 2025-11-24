import axios from "axios";
import ApiEndPoints from "../../constant/ApiEndpoint";

function getTotalEmployees(roles) {
  return roles.reduce((total, role) => {
    const count = Number(role.numberOfEmployees) || 0;
    return total + count;
  }, 0);
}
function mapToPayload(projectDetails) {
  return {
    projectName: projectDetails.projectName || "",
    projectDescription: projectDetails.projectDescription,
    projectStart: projectDetails.projectStart,
    projectEnd: projectDetails.projectEnd,
    taskDescription: projectDetails.taskDescription,
    requiredEmployees: getTotalEmployees(projectDetails.roles),
    links: projectDetails.links,
    selectedSkills: projectDetails.selectedSkills,
    selectedLocations: projectDetails.selectedLocations,
    roles: projectDetails.roles,
    createdBy:
      JSON.parse(localStorage.getItem("apiResponse")).username || "admin",
    status: "PLANNED",
    isPublished: false,
  };
}

export async function PostProject(payload) {
  console.log("Payload received for posting project:", payload);
  let mappedPayload = mapToPayload(payload);
  console.log("Posting project with payload:", mappedPayload);
  try {
    const response = await axios.post(
      localStorage.getItem("Base_URL") + ApiEndPoints.Create_Project,
      mappedPayload
    );
    console.log("Success:", response.data);
    return response.status;
  } catch (error) {
    console.error("Error:", error);
  }
}
