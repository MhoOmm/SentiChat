import axios from "axios";

const API = "http://localhost:5000/api/chat";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// ── Posts ──────────────────────────────────────────────────────────────
export const getPosts = () =>
  axios.get(`${API}/posts`);

export const getPost = (postId) =>
  axios.get(`${API}/post/${postId}`);

export const createPost = (data) =>
  axios.post(`${API}/post`, data, getAuthHeaders());

export const votePost = (postId, value) =>
  axios.post(`${API}/post/vote`, { postId, value }, getAuthHeaders());

// ── Comments ───────────────────────────────────────────────────────────
export const getComments = (postId) =>
  axios.get(`${API}/get-comments`, { params: { postId } });

export const createComment = (data) =>
  axios.post(`${API}/create-comment`, data, getAuthHeaders());

export const voteComment = (commentId, value) =>
  axios.post(`${API}/comment/vote`, { commentId, value }, getAuthHeaders());
