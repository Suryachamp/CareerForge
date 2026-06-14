import axios from "axios";

const api = axios.create({
  baseURL: `http://${window.location.hostname}:3000`,
  withCredentials: true,
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
