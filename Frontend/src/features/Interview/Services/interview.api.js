import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
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
