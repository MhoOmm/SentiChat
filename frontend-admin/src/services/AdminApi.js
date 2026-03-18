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

export const getAnnouncements = (token) => {
  return axios.get(`${API}/announcements/all`, {
    headers: { 
      Authorization: `Bearer ${token}` 
    },
  });
};

export const createAnnouncement = (data, token) => {
  return axios.post(`${API}/announcements/create`, data, { 
    headers: { 
      Authorization: `Bearer ${token}` 
    }, 
  });
};

export const getSentiment = (token) => {
  return axios.get(`${API}/sentiment/stats`, { 
    headers: { 
      Authorization: `Bearer ${token}` 
    }, 
  });
};