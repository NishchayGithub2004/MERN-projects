import express from "express"; // import express to create a router instance for handling message-related routes
import isAuthenticated from "../middlewares/isAuthenticated.js"; // import middleware to verify user authentication before accessing routes
import { 
    getMessage, // import controller function to fetch all messages for a specific user or chat
    sendMessage // import controller function to send a new message to a user or chat
} from "../controllers/message.controller.js"; // import message controller functions from the specified path

const messageRoute = express.Router(); // create a new router instance using express.Router() to define message-related routes

messageRoute
    .route('/send/:id') // define a route pattern '/send/:id' where ':id' represents the receiver's user ID as a route parameter
    .post(
        isAuthenticated, // apply authentication middleware to ensure only logged-in users can send messages
        sendMessage // call the sendMessage controller function to handle sending a message
    );

messageRoute
    .route('/all/:id') // define a route pattern '/all/:id' where ':id' represents the user or chat ID for fetching messages
    .get(
        isAuthenticated, // apply authentication middleware to ensure only authenticated users can fetch messages
        getMessage // call the getMessage controller function to handle retrieving all messages for that user or chat
    );

export default messageRoute; // export the router instance so it can be used in the main app to register message routes
