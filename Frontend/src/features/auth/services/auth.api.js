import axios from "axios";

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const api = axios.create({
  baseURL: isLocal ? `http://${window.location.hostname}:3000` : "https://careerforge-backend-w18z.onrender.com",
  withCredentials: true,
});

// This functions are written to interact with the api from frontend that are created in the backend

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error(err.response?.data?.message || "Registration failed. Please try again.");
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error(err.response?.data?.message || "Login failed. Please check your credentials.");
  }
}

export async function logout() {
  try {
    const response = await api.get("/api/auth/logout");
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error(err.response?.data?.message || "Logout failed.");
  }
}

export async function getMe() {
  try {
    const response = await api.get("/api/auth/get-me");
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error(err.response?.data?.message || "Session verification failed.");
  }
}
