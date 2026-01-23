import jwt from "jsonwebtoken"; // import 'jwt' object from 'jsonwebtoken' library to create and verify JSON Web Tokens
import User from "../models/User.js";
import { ENV } from "../lib/env.js"; // import 'ENV' object from 'env.js' file to access and use environment variables

export const protectRoute = async (req, res, next) => { // create a middleware named 'protectRoute' that ensures that user is authenticated before accessing backend functions
    // it takes request from user as object, backend response as object, and next function or middleware in flow as arguments
    try {
        const token = req.cookies.jwt; // extract JWT from cookies in user request object
        
        if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" }); // if no token is found, return a 401 response with a JSON message that user is unauthorized

        const decoded = jwt.verify(token, ENV.JWT_SECRET); // verify the provided token with JWT secret key present in 'JWT_SECRET' property of 'ENV' object
        
        if (!decoded) return res.status(401).json({ message: "Unauthorized - Invalid token" }); // if decoded token is invalid, return a 401 response with a JSON message that user is unauthorized

        const user = await User.findById(decoded.userId).select("-password"); // find user in database by ID extracted from decoded token and extract all fields except password
        
        if (!user) return res.status(404).json({ message: "User not found" }); // if user is not found in database, return a 404 response with a JSON message that user is not found

        req.user = user; // attach user data to request object for use in subsequent middleware or route handlers
        
        next(); // pass control to the next middleware or route handler using 'next' function
    } catch (error) { // if any error occurs during execution of this middleware
        console.log("Error in protectRoute middleware:", error); // log an error message to the console to know what error occurred
        res.status(500).json({ message: "Internal server error" }); // return a 500 response with a JSON message that internal server error occurred
    }
};