import axios from "axios";
import ApiEndPoints from "../../constant/ApiEndpoint";

export async function GetAllApplication() {
  const response = await axios.get(
    localStorage.getItem("Base_URL") + ApiEndPoints.Get_All_Project_Application
  );
  return response.data;
}
