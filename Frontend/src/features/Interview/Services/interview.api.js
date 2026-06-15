import axios from "axios";

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const api = axios.create({
    baseURL: isLocal ? `http://${window.location.hostname}:3000` : "https://careerforge-backend-w18z.onrender.com",
    withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function generateInterviewReport(formData) {
  try {
    const response = await api.post("/api/interview", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getInterviewReport(id) {
  try {
    const response = await api.get(`/api/interview/${id}`);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getAllInterviewReports() {
  try {
    const response = await api.get("/api/interview");
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
