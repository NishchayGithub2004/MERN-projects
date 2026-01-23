import axios from "axios"; // import 'axios' object from 'axios' package to make HTTP requests to the backend

export const axiosInstance = axios.create({ // create and export an instance of 'axios' object using 'create' function
    baseURL: "http://localhost:3000", // this is the base URL of the backend server
    withCredentials: true, // set 'withCredentials' property to 'true' to send cookies with requests for authentication
});