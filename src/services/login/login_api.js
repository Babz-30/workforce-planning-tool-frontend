import axios from "axios";

// change once deployed
const API_BASE_URL =
  "https://workforcemangementtool.onrender.com/api/auth";

export const login = async (username, password) => {
  return await axios.post(`${API_BASE_URL}/login`, {
    username: username,
    password: password,
  });
};
