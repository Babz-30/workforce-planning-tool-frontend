const ApiEndPoints = Object.freeze({
  Create_Project: "/api/projects",
  Get_Project_by_Creater: "/api/projects/by-creator/",
  Get_Project_by_Id: "/api/projects/",
  Get_Project_All_Projects: "/api/projects",
  Get_Project_All_Published_Projects: "/api/projects/published/true",
  Get_All_Project_Application: "/api/applications/all",
  Update_Project: "/api/projects/",
  Publish_Project: "/api/projects/{projectId}/publish",
  Delete_Project: "/api/projects/",
  Propose_Project: "/api/applications/suggest",
  Get_Applied_Projects_by_User:
    "/api/applications/grouped-by-project?status=APPLIED",
  Deparment_Header_Approval_And_Reject: "/api/project-manager/applications/",
});
export default ApiEndPoints;
