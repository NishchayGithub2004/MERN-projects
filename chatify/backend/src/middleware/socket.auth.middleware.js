import jwt from "jsonwebtoken"; // import 'jwt' object from 'jsonwebtoken' library to create and verify JWT tokens to authenticate users
import User from "../models/User.js";
import { ENV } from "../lib/env.js"; // import 'ENV' object from 'env.js' file to access and use environment variables

export const socketAuthMiddleware = async (socket, next) => { // create a function named 'socketAuthMiddleware' to authenticate socket connections
    // it takes two parameters: 'socket' object representing the socket connection and 'next' is the middleware or function to execute next when authentication is complete
    try {
        const token = socket.handshake.headers.cookie // read the cookie sent during socket.io handshake ie initial socket connection to initialize chatting
            ?.split("; ") // split the cookie string into individual cookies by splitting them by ';'
            .find((row) => row.startsWith("jwt=")) // find the cookie that starts with 'jwt='
            ?.split("=")[1]; // split the cookie found into key-value pair by splitting it by '=' and return the value of the cookie ie value after '=' which is the JWT token

        // if no JWT token is found, log a message to the console that socket connection is rejected since no token was provided and return an unauthorization error
        if (!token) {
            console.log("Socket connection rejected: No token provided");
            return next(new Error("Unauthorized - No Token Provided"));
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET); // verify the extracted JWT token with the JWT secret key stored in 'JWT_SECRET' property of 'ENV' object to check if user is authenticated or not
        
        // if the verification fails, log a message to the console that socket connection is rejected since token is invalid and return an unauthorization error
        if (!decoded) {
            console.log("Socket connection rejected: Invalid token");
            return next(new Error("Unauthorized - Invalid Token"));
        }

        const user = await User.findById(decoded.userId).select("-password"); // find the user associated with the decoded JWT token by querying the 'User' model using the 'findById' method and selecting all fields except the password field using the 'select' method
        
        // if no user is found, log a message to the console that socket connection is rejected since user is not found and return an unauthorization error
        if (!user) {
            console.log("Socket connection rejected: User not found");
            return next(new Error("User not found"));
        }

        socket.user = user; // attach the authenticated user object to 'user' property of 'socket' object for further use in socket handlers
        
        socket.userId = user._id.toString(); // attach the authenticated user's ID to 'userId' property of 'socket' object for further use in socket handlers

        console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`); // log a message to the console that socket connection is authenticated for the user, along with it log the user's full name and ID

        next(); // call the 'next' function to continue with the next middleware or function in the flow
    } catch (error) { // if any error occurs during the execution of the function ie when verifying user for socket connection using JWT token
        console.log("Error in socket authentication:", error.message); // log the error message to the console to know what error occurred
        next(new Error("Unauthorized - Authentication failed")); // return an unauthorization error
    }
};