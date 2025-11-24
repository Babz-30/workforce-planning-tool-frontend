import axios from "axios";
import ApiEndPoints from "../../constant/ApiEndpoint";

function getTotalEmployees(roles) {
  return roles.reduce((total, role) => {
    const count = Number(role.numberOfEmployees) || 0;
    return total + count;
  }, 0);
}

function mapToPayload(projectDetails, existingProjectDetails) {
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
    createdBy: existingProjectDetails.createdBy,
    status: "PLANNED",
    isPublished: false,
    updatedBy:
      JSON.parse(localStorage.getItem("apiResponse")).username || "admin",
    projectId: existingProjectDetails.projectId,
  };
}

export async function EditProjectData(payload, projectDetails) {
  let mappedPayload = mapToPayload(payload, projectDetails);
  try {
    const response = await axios.put(
      localStorage.getItem("Base_URL") +
        ApiEndPoints.Update_Project +
        projectDetails.projectId,
      mappedPayload
    );
    console.log("Success:", response.data);
    return response.status;
  } catch (error) {
    console.error("Error:", error);
  }
}
