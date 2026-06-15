import axios from "axios";

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const api = axios.create({
  baseURL: isLocal ? `http://${window.location.hostname}:3000` : "https://careerforge-backend-w18z.onrender.com",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function generateResume(resumeData) {
  try {
    const response = await api.post("/api/resume/generate", resumeData);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getResume(id) {
  try {
    const response = await api.get(`/api/resume/${id}`);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getAllResumes() {
  try {
    const response = await api.get("/api/resume");
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
