import express from "express"; // import express module to create a router for user-related API routes
import { // import controller functions from user.controller.js to handle user operations
    getUserProfile, // function to fetch profile details of the authenticated user
    login, // function to authenticate a user and issue a session or token
    logout, // function to log out a user and clear their session or cookies
    register, // function to register a new user with provided credentials
    updateProfile // function to update user's profile details, including photo
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js"; // import middleware to ensure only logged-in users can access certain routes
import upload from "../utils/multer.js"; // import multer configuration to handle file uploads like profile pictures

const userRoute = express.Router(); // create a new Express router instance to define user-related endpoints

userRoute.route("/register") // define route for user registration
    .post( // use POST method to create a new user
        register // call register controller to handle new user registration logic
    );

userRoute.route("/login") // define route for user login
    .post( // use POST method since credentials are sent from client to server
        login // call login controller to authenticate user credentials and create a session/token
    );

userRoute.route("/logout") // define route for user logout
    .get( // use GET method to log out the user
        logout // call logout controller to clear user session or cookies
    );

userRoute.route("/profile") // define route to fetch profile information
    .get( // use GET method to retrieve user profile
        isAuthenticated, // ensure user is logged in before accessing profile
        getUserProfile // call getUserProfile controller to return details of the authenticated user
    );

userRoute.route("/profile/update") // define route for updating profile details
    .put( // use PUT method to modify existing user data
        isAuthenticated, // ensure the user is authenticated before updating their profile
        upload.single("profilePhoto"), // use multer’s single method with field name "profilePhoto" to handle uploading new profile image
        updateProfile // call updateProfile controller to update user data and uploaded profile photo
    );

export default userRoute; // export userRoute so it can be imported and used in the main server file