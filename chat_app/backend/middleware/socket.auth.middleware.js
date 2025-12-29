import jwt from "jsonwebtoken"; // import jsonwebtoken to verify and decode jwt tokens for socket authentication
import User from "../models/User.js"; // import the User model to fetch and validate the connecting user from the database
import { ENV } from "../lib/env.js"; // import environment configuration to access the jwt secret

export const socketAuthMiddleware = async (socket, next) => { // define a socket.io middleware to authenticate users before establishing a socket connection
    try { // wrap socket authentication logic in a try block to handle verification and database errors
        // extract and validate jwt token from socket cookies, verify authenticity, and resolve associated user
        const token = socket.handshake.headers.cookie // access raw cookie header from the socket handshake to locate authentication token
            ?.split("; ") // split cookies into individual key-value pairs for parsing
            .find((row) => row.startsWith("jwt=")) // find the cookie entry that contains the jwt token
            ?.split("=")[1]; // extract the token value from the jwt cookie

        if (!token) { // check whether a jwt token was provided by the client
            console.log("Socket connection rejected: No token provided"); // log rejection reason for debugging and audit visibility            
            return next(new Error("Unauthorized - No Token Provided")); // reject the socket connection due to missing authentication
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET); // verify the jwt token using the secret and decode its payload
        
        if (!decoded) { // validate that token verification succeeded
            console.log("Socket connection rejected: Invalid token"); // log invalid token attempt for security tracking
            return next(new Error("Unauthorized - Invalid Token")); // reject the socket connection due to invalid token
        }

        const user = await User.findById(decoded.userId).select("-password"); // fetch the authenticated user while excluding sensitive password data
        
        if (!user) { // check whether the user referenced by the token exists in the database
            console.log("Socket connection rejected: User not found"); // log missing user scenario for troubleshooting
            return next(new Error("User not found")); // reject the socket connection if the user does not exist
        }

        socket.user = user; // attach the authenticated user object to the socket for downstream access
        
        socket.userId = user._id.toString(); // store the user id on the socket for quick identification and mapping

        console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`); // log successful socket authentication with user context

        next(); // allow the socket connection to proceed after successful authentication
    } catch (error) { // catch unexpected errors during token parsing, verification, or database access
        console.log("Error in socket authentication:", error.message); // log the error message to aid debugging
        next(new Error("Unauthorized - Authentication failed")); // reject the socket connection due to authentication failure
    }
};