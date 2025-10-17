import express from "express"; // import express module to create a router for handling course progress routes
import isAuthenticated from "../middlewares/isAuthenticated.js"; // import middleware to verify if the user is logged in before accessing any progress route
import { // import multiple controller functions from courseProgress.controller.js to manage course progress logic
    getCourseProgress, // function to get progress details of a specific course for the authenticated user
    markAsCompleted, // function to mark an entire course as completed by the user
    markAsInCompleted, // function to mark an entire course as incomplete by the user
    updateLectureProgress // function to update progress of a single lecture (e.g., when user views a lecture)
} from "../controllers/courseProgress.controller.js";

const courseProgressRoute = express.Router(); // create a new Express router instance to define course progress-related routes

courseProgressRoute.route("/:courseId") // define dynamic route with courseId parameter to identify the course
    .get( // use GET method to handle retrieving course progress
        isAuthenticated, // ensure that only authenticated users can access their progress
        getCourseProgress // call getCourseProgress controller with courseId argument to fetch progress data
    );

courseProgressRoute.route("/:courseId/lecture/:lectureId/view") // define route for updating lecture progress within a specific course
    .post( // use POST method to record lecture viewing activity
        isAuthenticated, // ensure user is authenticated before updating progress
        updateLectureProgress // call updateLectureProgress controller with courseId and lectureId arguments to update viewing status
    );

courseProgressRoute.route("/:courseId/complete") // define route to mark a specific course as completed
    .post( // use POST method to trigger completion
        isAuthenticated, // ensure the user is logged in
        markAsCompleted // call markAsCompleted controller with courseId argument to mark the course as fully completed
    );

courseProgressRoute.route("/:courseId/incomplete") // define route to mark a specific course as incomplete
    .post( // use POST method to trigger incompletion
        isAuthenticated, // ensure user is authenticated
        markAsInCompleted // call markAsInCompleted controller with courseId argument to revert course status to incomplete
    );

export default courseProgressRoute; // export courseProgressRoute to make it available for use in main server routing