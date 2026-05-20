import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Attach JWT token to every request
API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// Handle expired token
API.interceptors.response.use(
  (response) => response,

  (error) => {

    if (
      error.response &&
      error.response.status === 401
    ) {

      localStorage.removeItem("token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;