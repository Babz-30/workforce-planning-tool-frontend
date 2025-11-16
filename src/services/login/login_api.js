import axios from "axios";

// change once deployed
const API_BASE_URL =
  "http://sushwfappdnsnew11.eastus.azurecontainer.io:8080/api/auth";

export const login = async (username, password) => {
  return await axios.post(`${API_BASE_URL}/login`, {
    username: username,
    password: password,
  });
};
