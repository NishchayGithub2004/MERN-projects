import express from "express"; // import express to use its routing capabilities for defining post-related routes
import isAuthenticated from "../middlewares/isAuthenticated.js"; // import middleware to ensure the user is authenticated before accessing post routes
import upload from "../middlewares/multer.js"; // import multer middleware to handle image file uploads for new posts
import { 
    addComment, // import controller to handle adding a comment to a post
    addNewPost, // import controller to handle creation of a new post
    bookmarkPost, // import controller to handle bookmarking a specific post
    deletePost, // import controller to handle deletion of a specific post
    dislikePost, // import controller to handle disliking a post
    getAllPost, // import controller to retrieve all posts available to the user
    getCommentsOfPost, // import controller to retrieve all comments of a specific post
    getUserPost, // import controller to fetch all posts made by a specific user
    likePost // import controller to handle liking a post
} from "../controllers/post.controller.js"; // import all post controller functions from the specified path

const postRoute = express.Router(); // create a new router instance using express.Router() for handling post-related routes

postRoute
    .route("/addpost") // define a POST route pattern '/addpost' for creating a new post
    .post(
        isAuthenticated, // apply authentication middleware to ensure only logged-in users can add posts
        upload.single('image'), // use multer middleware to handle a single image upload with field name 'image'
        addNewPost // call the addNewPost controller function to handle the logic of adding a new post
    );

postRoute
    .route("/all") // define a GET route pattern '/all' for retrieving all posts
    .get(
        isAuthenticated, // apply authentication middleware to protect route access
        getAllPost // call the getAllPost controller to fetch all posts for the user
    );

postRoute
    .route("/userpost/all") // define a GET route pattern '/userpost/all' for fetching all posts created by the logged-in user
    .get(
        isAuthenticated, // apply authentication middleware to verify the user
        getUserPost // call the getUserPost controller to get all posts of the authenticated user
    );

postRoute
    .route("/:id/like") // define a GET route pattern '/:id/like' where ':id' is the post ID for liking a post
    .get(
        isAuthenticated, // apply authentication middleware to ensure user is logged in
        likePost // call the likePost controller to handle liking functionality for the post
    );

postRoute
    .route("/:id/dislike") // define a GET route pattern '/:id/dislike' where ':id' is the post ID for disliking a post
    .get(
        isAuthenticated, // ensure only authenticated users can dislike posts
        dislikePost // call the dislikePost controller to handle disliking logic
    );

postRoute
    .route("/:id/comment") // define a POST route pattern '/:id/comment' where ':id' represents the post ID for adding a comment
    .post(
        isAuthenticated, // ensure the user is authenticated before adding a comment
        addComment // call the addComment controller to handle creating and attaching the comment to the post
    );

postRoute
    .route("/:id/comment/all") // define a POST route pattern '/:id/comment/all' to fetch all comments of a specific post
    .post(
        isAuthenticated, // apply authentication middleware to protect comment access
        getCommentsOfPost // call the getCommentsOfPost controller to retrieve all comments for the given post
    );

postRoute
    .route("/delete/:id") // define a DELETE route pattern '/delete/:id' where ':id' is the post ID to be deleted
    .delete(
        isAuthenticated, // ensure only authenticated users can delete posts
        deletePost // call the deletePost controller to handle the deletion process
    );

postRoute
    .route("/:id/bookmark") // define a GET route pattern '/:id/bookmark' where ':id' is the post ID for bookmarking
    .get(
        isAuthenticated, // ensure the user is authenticated before bookmarking
        bookmarkPost // call the bookmarkPost controller to handle bookmarking logic
    );

export default postRoute; // export the router instance so it can be used in the main application for registering post routes
