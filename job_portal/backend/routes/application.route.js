import express from "express"; // import express to create a router for handling routes
import isAuthenticated from "../middlewares/isAuthenticated.js"; // import middleware to verify user authentication
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js"; // import application-related controller functions

const applicationRoute = express.Router(); // create a new router instance to define application-related routes

applicationRoute.route("/apply/:id").get(isAuthenticated, applyJob); // define a GET route for applying to a job, authenticate user first, then call applyJob controller
applicationRoute.route("/get").get(isAuthenticated, getAppliedJobs); // define a GET route to fetch all jobs the authenticated user applied for
applicationRoute.route("/:id/applicants").get(isAuthenticated, getApplicants); // define a GET route to fetch all applicants for a specific job by ID
applicationRoute.route("/status/:id/update").post(isAuthenticated, updateStatus); // define a POST route to update the status of a specific application, only for authenticated users

export default applicationRoute; // export the router to be used in the main application
