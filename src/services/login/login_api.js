import axios from "axios";

// change once deployed
const API_BASE_URL =
  "https://agile2-dsg7a3etc7ephaam.canadacentral-01.azurewebsites.net/api/auth";

export const login = async (username, password) => {
  return await axios.post(`${API_BASE_URL}/login`, {
    username: username,
    password: password,
  });
};
