import express from "express"; // import express to define user-related routing
import isAuth from "../middlewares/isAuth.js"; // import authentication middleware to protect user endpoints
import { getCurrentUser, UpdateProfile } from "../controllers/userController.js"; // import controllers for user profile retrieval and updates
import upload from "../middlewares/multer.js"; // import multer middleware to handle profile image uploads

let userRouter = express.Router(); // create a router instance for user domain routes

userRouter.get("/currentuser", isAuth, getCurrentUser); // return the authenticated user's profile data
userRouter.post("/updateprofile", isAuth, upload.single("photoUrl"), UpdateProfile); // update user profile details with optional image upload

export default userRouter; // export user router for integration into the main application