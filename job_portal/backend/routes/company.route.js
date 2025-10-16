import express from "express"; // import express to create a router for handling routes
import isAuthenticated from "../middlewares/isAuthenticated.js"; // import middleware to verify user authentication
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js"; // import company-related controller functions
import { singleUpload } from "../middlewares/multer.js"; // import multer middleware for handling single file uploads

const companyRoute = express.Router(); // create a new router instance to define company-related routes

companyRoute.route("/register").post(isAuthenticated, registerCompany); // define a POST route to register a new company, authenticate user first, then call registerCompany controller
companyRoute.route("/get").get(isAuthenticated, getCompany); // define a GET route to fetch all companies created by the authenticated user
companyRoute.route("/get/:id").get(isAuthenticated, getCompanyById); // define a GET route to fetch a single company by ID for the authenticated user
companyRoute.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany); // define a PUT route to update a company's info, authenticate user first, handle file upload, then call updateCompany controller

export default companyRoute; // export the router to be used in the main application
