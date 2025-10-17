import express from "express"; // import express module to create router for course-related routes
import isAuthenticated from "../middlewares/isAuthenticated.js"; // import custom middleware to verify if the user is authenticated before accessing certain routes
import { // import multiple controller functions from course.controller.js to handle different course operations
    createCourse, // function to handle course creation
    createLecture, // function to handle lecture creation within a course
    editCourse, // function to handle editing an existing course
    editLecture, // function to handle editing an existing lecture
    getCourseById, // function to fetch a specific course using its ID
    getCourseLecture, // function to fetch all lectures of a specific course
    getCreatorCourses, // function to fetch all courses created by a logged-in user
    getLectureById, // function to fetch a specific lecture by its ID
    getPublishedCourse, // function to fetch all published courses visible to learners
    removeLecture, // function to delete a lecture by its ID
    searchCourse, // function to search for courses by keyword or filter
    togglePublishCourse // function to change course publish status (publish/unpublish)
} from "../controllers/course.controller.js";
import upload from "../utils/multer.js"; // import multer configuration to handle file uploads like course thumbnails

const courseRoute = express.Router(); // create an Express router instance to define course-related routes

courseRoute.route("/") // define route for base path "/"
    .post( // use POST method to handle course creation
        isAuthenticated, // pass isAuthenticated middleware as first argument to ensure only logged-in users can create courses
        createCourse // pass createCourse controller function as second argument to handle the logic of creating a new course
    );

courseRoute.route("/search") // define route for "/search"
    .get( // use GET method to handle searching courses
        isAuthenticated, // use isAuthenticated middleware to ensure only logged-in users can search
        searchCourse // pass searchCourse controller to handle logic of searching courses
    );

courseRoute.route("/published-courses") // define route for fetching all published courses
    .get( // use GET method to handle retrieval
        getPublishedCourse // directly call getPublishedCourse controller since no authentication is needed
    );

courseRoute.route("/") // define route for base path "/" again but with GET request
    .get( // use GET method to handle fetching courses created by the authenticated user
        isAuthenticated, // ensure user is logged in
        getCreatorCourses // call getCreatorCourses controller to get user's created courses
    );

courseRoute.route("/:courseId") // define dynamic route with parameter courseId
    .put( // use PUT method to handle updating a specific course
        isAuthenticated, // ensure only authenticated users can update
        upload.single("courseThumbnail"), // use multer’s single file upload method with "courseThumbnail" as field name to handle course image upload
        editCourse // call editCourse controller to perform edit operation on the given course
    );

courseRoute.route("/:courseId") // define route to fetch course by ID
    .get( // use GET method to retrieve course details
        isAuthenticated, // ensure the user is authenticated
        getCourseById // call getCourseById controller with courseId parameter to fetch specific course
    );

courseRoute.route("/:courseId/lecture") // define route for lecture creation under specific course
    .post( // use POST method to handle adding a new lecture
        isAuthenticated, // ensure user is authenticated before adding lecture
        createLecture // call createLecture controller with courseId parameter
    );

courseRoute.route("/:courseId/lecture") // define route to fetch lectures for a specific course
    .get( // use GET method to retrieve lectures
        isAuthenticated, // ensure user is logged in
        getCourseLecture // call getCourseLecture controller to get all lectures under a specific course
    );

courseRoute.route("/:courseId/lecture/:lectureId") // define route for editing a specific lecture under a course
    .post( // use POST method to handle lecture edit
        isAuthenticated, // ensure user is authenticated
        editLecture // call editLecture controller with courseId and lectureId parameters to update lecture details
    );

courseRoute.route("/lecture/:lectureId") // define route for deleting a specific lecture
    .delete( // use DELETE method to remove lecture
        isAuthenticated, // ensure user is authenticated
        removeLecture // call removeLecture controller with lectureId parameter to delete lecture
    );

courseRoute.route("/lecture/:lectureId") // define route for fetching a specific lecture by ID
    .get( // use GET method to retrieve lecture details
        isAuthenticated, // ensure user is logged in
        getLectureById // call getLectureById controller with lectureId parameter
    );

courseRoute.route("/:courseId") // define route for toggling course publish status
    .patch( // use PATCH method to handle partial update
        isAuthenticated, // ensure only logged-in creators can change publish status
        togglePublishCourse // call togglePublishCourse controller to toggle between published and unpublished states
    );

export default courseRoute; // export courseRoute so it can be used in the main server file