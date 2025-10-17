import express from "express"; // import express to use its routing features for defining user-related routes
import { 
    editProfile, // import controller to handle updating user profile details
    followOrUnfollow, // import controller to handle following or unfollowing another user
    getProfile, // import controller to handle fetching a user's profile information
    getSuggestedUsers, // import controller to handle fetching a list of suggested users to follow
    login, // import controller to handle user login authentication
    logout, // import controller to handle logging out the user
    register // import controller to handle user registration and account creation
} from "../controllers/user.controller.js"; // import all user controller functions from the specified path
import isAuthenticated from "../middlewares/isAuthenticated.js"; // import middleware to verify authentication before granting access to protected routes
import upload from "../middlewares/multer.js"; // import multer middleware to handle profile image uploads

const userRoute = express.Router(); // create a new express router instance to define user-related API routes

userRoute
    .route('/register') // define a POST route '/register' for registering new users
    .post(
        register // call the register controller to handle user registration logic
    );

userRoute
    .route('/login') // define a POST route '/login' for user login
    .post(
        login // call the login controller to authenticate users and generate tokens
    );

userRoute
    .route('/logout') // define a GET route '/logout' for user logout
    .get(
        logout // call the logout controller to handle session termination or token invalidation
    );

userRoute
    .route('/:id/profile') // define a GET route '/:id/profile' where ':id' represents the user ID to fetch their profile
    .get(
        isAuthenticated, // apply authentication middleware to ensure only logged-in users can view profiles
        getProfile // call the getProfile controller to fetch the specified user's profile details
    );

userRoute
    .route('/profile/edit') // define a POST route '/profile/edit' for editing the user's profile
    .post(
        isAuthenticated, // apply authentication middleware to ensure only authenticated users can edit profiles
        upload.single('profilePhoto'), // use multer middleware to handle single image upload with field name 'profilePhoto'
        editProfile // call the editProfile controller to update user profile data in the database
    );

userRoute
    .route('/suggested') // define a GET route '/suggested' for fetching a list of suggested users
    .get(
        isAuthenticated, // apply authentication middleware to ensure access only for logged-in users
        getSuggestedUsers // call the getSuggestedUsers controller to retrieve users that the current user might want to follow
    );

userRoute
    .route('/followorunfollow/:id') // define a POST route '/followorunfollow/:id' where ':id' is the target user to follow or unfollow
    .post(
        isAuthenticated, // apply authentication middleware to ensure only logged-in users can follow/unfollow others
        followOrUnfollow // call the followOrUnfollow controller to toggle following status for the specified user
    );

export default userRoute; // export the router instance to make it available for use in the main app for registering user routes
