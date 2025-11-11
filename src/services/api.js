import axios from "axios";

// change once deployed
const API_BASE_URL = "http://localhost:8080/api"; 

export const login = async (username, password) => {
  return await axios.post(`${API_BASE_URL}/login`, {
    username,
    password,
  });
};
