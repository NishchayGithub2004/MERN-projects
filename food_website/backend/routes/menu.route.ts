import express from "express" // import the express module to create routers and handle HTTP requests
import upload from "../middlewares/multer" // import the multer middleware for handling file uploads
import { isAuthenticated } from "../middlewares/isAuthenticated" // import middleware to check if the user is authenticated
import { addMenu, editMenu } from "../controller/menu.controller" // import controller functions to add and edit menu items

const menuRoute = express.Router() // create a new router instance to define menu-related routes

menuRoute.route("/").post(isAuthenticated, upload.single("image"), addMenu) // define POST route at "/" with authentication, single image upload, and addMenu controller

menuRoute.route("/:id").put(isAuthenticated, upload.single("image"), editMenu) // define PUT route at "/:id" with authentication, single image upload, and editMenu controller

export default menuRoute // export the router so it can be used in the main app
