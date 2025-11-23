import axios from "axios";

// change once deployed
// let API_BASE_URL =
//   "https://agile2-dsg7a3etc7ephaam.canadacentral-01.azurewebsites.net";

export const login = async (username, password) => {
  let res = await axios.post(
    `${localStorage.getItem("Base_URL")}/api/auth/login`,
    {
      username: username,
      password: password,
    }
  );
  localStorage.setItem("apiResponse", JSON.stringify(res.data));
  console.log(
    "Login API response:",
    localStorage.getItem("apiResponse.username")
  );
  return res;
};
