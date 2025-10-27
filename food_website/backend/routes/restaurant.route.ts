import express from "express" // import the express module to create routers and handle HTTP requests
import { createRestaurant, getRestaurant, getRestaurantOrder, getSingleRestaurant, searchRestaurant, updateOrderStatus, updateRestaurant } from "../controller/restaurant.controller" // import controller functions for creating, updating, retrieving restaurants, orders, and searching
import upload from "../middlewares/multer" // import multer middleware for handling file uploads
import { isAuthenticated } from "../middlewares/isAuthenticated" // import middleware to check if the user is authenticated

const restaurantRoute = express.Router() // create a new router instance to define restaurant-related routes

restaurantRoute.route("/").post(isAuthenticated, upload.single("imageFile"), createRestaurant) // define POST route at "/" with authentication, single image upload, and createRestaurant controller
restaurantRoute.route("/").get(isAuthenticated, getRestaurant) // define GET route at "/" with authentication and getRestaurant controller
restaurantRoute.route("/").put(isAuthenticated, upload.single("imageFile"), updateRestaurant) // define PUT route at "/" with authentication, single image upload, and updateRestaurant controller
restaurantRoute.route("/order").get(isAuthenticated, getRestaurantOrder) // define GET route at "/order" with authentication and getRestaurantOrder controller
restaurantRoute.route("/order/:orderId/status").put(isAuthenticated, updateOrderStatus) // define PUT route at "/order/:orderId/status" with authentication and updateOrderStatus controller
restaurantRoute.route("/search/:searchText").get(isAuthenticated, searchRestaurant) // define GET route at "/search/:searchText" with authentication and searchRestaurant controller
restaurantRoute.route("/:id").get(isAuthenticated, getSingleRestaurant) // define GET route at "/:id" with authentication and getSingleRestaurant controller

export default restaurantRoute // export the router so it can be used in the main app
