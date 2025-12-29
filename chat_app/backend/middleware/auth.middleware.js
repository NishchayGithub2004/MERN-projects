import jwt from "jsonwebtoken"; // import jsonwebtoken to verify and decode JWTs for request authentication
import User from "../models/User.js"; // import the User model to fetch authenticated user data from the database
import { ENV } from "../lib/env.js"; // import environment configuration to access the JWT secret

export const protectRoute = async (req, res, next) => { // define middleware to protect routes by validating user authentication
    try { // wrap authentication logic in a try block to handle verification and database errors
        const token = req.cookies.jwt; // read the JWT token from request cookies for authentication
        
        if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" }); // block access if no authentication token is present

        const decoded = jwt.verify(token, ENV.JWT_SECRET); // verify the JWT using the secret and decode the payload
        
        if (!decoded) return res.status(401).json({ message: "Unauthorized - Invalid token" }); // reject the request if token verification fails

        const user = await User.findById(decoded.userId).select("-password"); // fetch the authenticated user from the database while excluding the password
        
        if (!user) return res.status(404).json({ message: "User not found" }); // return an error if the user linked to the token does not exist

        req.user = user; // attach the authenticated user object to the request for downstream handlers
        
        next(); // pass control to the next middleware or route handler after successful authentication
    } catch (error) { // catch unexpected errors during token verification or database access
        console.log("Error in protectRoute middleware:", error); // log the error for debugging and monitoring
        res.status(500).json({ message: "Internal server error" }); // respond with a generic server error to avoid leaking sensitive details
    }
};