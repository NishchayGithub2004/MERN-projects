import express from "express" // import the express module to create routers and handle HTTP requests
import { checkAuth, forgotPassword, login, logout, resetPassword, signup, updateProfile, verifyEmail } from "../controller/user.controller" // import controller functions for user authentication, profile management, and password handling
import { isAuthenticated } from "../middlewares/isAuthenticated" // import middleware to check if the user is authenticated

const userRoute = express.Router() // create a new router instance to define user-related routes

userRoute.route("/check-auth").get(isAuthenticated, checkAuth) // define GET route at "/check-auth" with authentication and checkAuth controller
userRoute.route("/signup").post(signup) // define POST route at "/signup" with signup controller
userRoute.route("/login").post(login) // define POST route at "/login" with login controller
userRoute.route("/logout").post(logout) // define POST route at "/logout" with logout controller
userRoute.route("/verify-email").post(verifyEmail) // define POST route at "/verify-email" with verifyEmail controller
userRoute.route("/forgot-password").post(forgotPassword) // define POST route at "/forgot-password" with forgotPassword controller
userRoute.route("/reset-password/:token").post(resetPassword) // define POST route at "/reset-password/:token" with resetPassword controller
userRoute.route("/profile/update").put(isAuthenticated, updateProfile) // define PUT route at "/profile/update" with authentication and updateProfile controller

export default userRoute // export the router so it can be used in the main app
