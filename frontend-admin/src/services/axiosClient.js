import axios from "axios";

const baseURL = import.meta.env.DEV 
  ? "http://localhost:5000" 
  : "https://senti-chat-36sq.vercel.app";

const axiosClient = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosClient;
