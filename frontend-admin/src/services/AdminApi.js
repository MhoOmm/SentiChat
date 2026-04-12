import axios from "axios";

const API = "http://localhost:5000/api";

export const loginAdmin = (data) => {
  return axios.post(`${API}/admin/login-admin`, data);
};

export const getAdmin = (token) => {
  return axios.get(`${API}/admin/dashboard`, {
    headers: {
      Authorization: token
    }
  });
};

export const getAnnouncements = (token) => {
  return axios.get(`${API}/poll/announcements/all`, {
    headers: { 
      Authorization: `Bearer ${token}` 
    },
  });
};

export const createAnnouncement = (data, token) => {
  return axios.post(`${API}/admin/announcements/create`, data, { 
    headers: { 
      Authorization: `Bearer ${token}` 
    }, 
  });
};

export const createPoll = (data, token) => {
  return axios.post(`${API}/admin/polls/create`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
};

export const getPolls = (token) => {
  return axios.get(`${API}/poll/polls/all`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
};

export const getSentiment = (token) => {
  return axios.get(`${API}/admin/sentiment/stats`, { 
    headers: { 
      Authorization: `Bearer ${token}` 
    }, 
  });
};