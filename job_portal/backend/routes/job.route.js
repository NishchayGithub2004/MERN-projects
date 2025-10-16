import express from "express"; // import express to create a router for handling routes
import isAuthenticated from "../middlewares/isAuthenticated.js"; // import middleware to verify user authentication
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js"; // import job-related controller functions

const jobRoute = express.Router(); // create a new router instance to define job-related routes

jobRoute.route("/post").post(isAuthenticated, postJob); // define a POST route to create a new job, authenticate user first, then call postJob controller
jobRoute.route("/get").get(isAuthenticated, getAllJobs); // define a GET route to fetch all jobs, optionally filtered by keyword
jobRoute.route("/getadminjobs").get(isAuthenticated, getAdminJobs); // define a GET route to fetch all jobs created by the authenticated admin
jobRoute.route("/get/:id").get(isAuthenticated, getJobById); // define a GET route to fetch a single job by its ID

export default jobRoute; // export the router to be used in the main application
