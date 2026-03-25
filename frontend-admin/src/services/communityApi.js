import axios from "axios";

const API = "http://localhost:5000/api/chat";

const withCreds = { withCredentials: true };

// ── Posts ──────────────────────────────────────────────────────────────
export const getPosts = () =>
  axios.get(`${API}/posts`, withCreds);

export const getPost = (postId) =>
  axios.get(`${API}/post/${postId}`, withCreds);

export const createPost = (data) =>
  axios.post(`${API}/post`, data, withCreds);

export const votePost = (postId, type) =>
  axios.post(`${API}/post/vote`, { postId, type }, withCreds);

// ── Comments ───────────────────────────────────────────────────────────
export const getComments = (postId) =>
  axios.get(`${API}/get-comments`, { params: { postId }, ...withCreds });

export const createComment = (data) =>
  axios.post(`${API}/create-comment`, data, withCreds);

export const voteComment = (commentId, type) =>
  axios.post(`${API}/comment/vote`, { commentId, type }, withCreds);
