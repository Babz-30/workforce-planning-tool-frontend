import axios from "axios";

export const login = async (username, password) => {
  let res = await axios.post(
    `${localStorage.getItem("Base_URL")}/api/auth/login`,
    {
      username: username,
      password: password,
    }
  );
  localStorage.setItem("loginResponse", JSON.stringify(res.data));
  console.log(
    "Login API response:",
    JSON.parse(localStorage.getItem("loginResponse")).username
  );
  return res;
};
