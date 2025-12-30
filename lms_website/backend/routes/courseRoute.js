import express from "express"; // import express to define course-related routing
import isAuth from "../middlewares/isAuth.js"; // import authentication middleware to protect restricted routes
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getCreatorById, getCreatorCourses, getPublishedCourses, removeCourse, removeLecture } from "../controllers/courseController.js"; // import course controllers handling CRUD and lecture operations
import upload from "../middlewares/multer.js"; // import multer middleware to handle file uploads

let courseRouter = express.Router(); // create router instance for course domain endpoints

courseRouter.post("/create", isAuth, createCourse); // allow authenticated users to create a new course
courseRouter.get("/getpublishedcoures", getPublishedCourses); // expose published courses for public access
courseRouter.get("/getcreatorcourses", isAuth, getCreatorCourses); // fetch courses created by the authenticated user
courseRouter.post("/editcourse/:courseId", isAuth, upload.single("thumbnail"), editCourse); // update course details with optional thumbnail upload
courseRouter.get("/getcourse/:courseId", isAuth, getCourseById); // retrieve a single course by identifier
courseRouter.delete("/removecourse/:courseId", isAuth, removeCourse); // delete a course owned by the authenticated creator
courseRouter.post("/createlecture/:courseId", isAuth, createLecture); // add a lecture to a specific course
courseRouter.get("/getcourselecture/:courseId", isAuth, getCourseLecture); // retrieve lectures associated with a course
courseRouter.post("/editlecture/:lectureId", isAuth, upload.single("videoUrl"), editLecture); // update lecture metadata and optional video file
courseRouter.delete("/removelecture/:lectureId", isAuth, removeLecture); // remove a lecture and unlink it from its course
courseRouter.post("/getcreator", isAuth, getCreatorById); // fetch creator profile details by identifier

export default courseRouter; // export router for integration into the main application