import axios from "axios"; // import axios to perform HTTP requests to backend APIs in a standardized and configurable way

export const axiosInstance = axios.create({ // create and export a preconfigured axios instance to centralize API configuration across the application
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api", // dynamically set the API base URL based on environment to use local backend in development and relative path in production
    withCredentials: true, // enable sending cookies and authentication headers with requests to support session-based or cookie-based auth
});