import axios from "axios";

const API = "http://localhost:5000/api/admin";

export const loginAdmin = (data) => {
  return axios.post(`${API}/login-admin`, data);
};

export const getAdmin = (token) => {
  return axios.get(`${API}/dashboard`, {
    headers: {
      Authorization: token
    }
  });
};