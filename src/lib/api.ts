import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  // Ensure cookies (httpOnly) are always sent with requests
  withCredentials: true,
});

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Redirect to the appropriate login page
        const path = window.location.pathname;
        if (path.startsWith("/admin")) {
          window.location.href = "/admin/login";
        } else if (path.startsWith("/doctor")) {
          window.location.href = "/doctor/login";
        } else {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
