import express from "express"; // import express to create a router for handling routes
import { login, logout, register, updateProfile } from "../controllers/user.controller.js"; // import user-related controller functions
import isAuthenticated from "../middlewares/isAuthenticated.js"; // import middleware to verify user authentication
import { singleUpload } from "../middlewares/multer.js"; // import multer middleware for handling single file uploads

const userRoute = express.Router(); // create a new router instance to define user-related routes

userRoute.route("/register").post(singleUpload, register); // define a POST route to register a new user, handle file upload, then call register controller
userRoute.route("/login").post(login); // define a POST route to log in a user using login controller
userRoute.route("/logout").get(logout); // define a GET route to log out a user using logout controller
userRoute.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile); // define a POST route to update user profile, authenticate user first, handle file upload, then call updateProfile controller

export default userRoute; // export the router to be used in the main application
