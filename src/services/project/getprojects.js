import axios from "axios";
import ApiEndPoints from "../../constant/ApiEndpoint";
import { convertProjectsList } from "../../helper/apiBinder";

export async function GetProjectByCreator() {
  const response = await axios.get(
    localStorage.getItem("Base_URL") +
      ApiEndPoints.Get_Project_by_Creater +
      JSON.parse(localStorage.getItem("apiResponse")).username
  );
  console.log("Response data:", response.data);
  let res = convertProjectsList(response.data.data);
  return res;
}

export async function GetProjectById(ProjectId) {
  const response = await axios.get(
    localStorage.getItem("Base_URL") +
      ApiEndPoints.Get_Project_by_Id +
      ProjectId
  );
  return response.data.data;
}
