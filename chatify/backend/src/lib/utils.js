import jwt from "jsonwebtoken"; // import 'jwt' object from 'jsonwebtoken' package to generate JWT tokens for user authentication
import { ENV } from "./env.js"; // import 'ENV' object from 'env.js' file to access and use environment variables

export const generateToken = (userId, res) => { // create a function named 'generateToken' to generate JWT tokens for user authentication
    // this function takes two parameters: 'userId' which is unique ID of user and 'res' which is response object that sends function's response back to the user
    const { JWT_SECRET } = ENV; // extract value of 'JWT_SECRET' environment variable from 'ENV' object
    
    // if 'JWT_SECRET' environment variable doesn't have a value, throw an error message
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET doesn't have a value");
    }

    // create and sign a JWT token using 'sign' function, provide user's unique ID as payload and 'JWT_SECRET' as secret key to verify user, set token's expiration time to 7 days
    const token = jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: "7d",
    });

    // set value of 'jwt' cookie in response object with signed token, set cookie's expiration time to 7 days, set 'httpOnly' to true so that javascript can't access the cookie
    // set value of'sameSite' flag to 'strict' to restrict cookie to this project only, set 'secure' flag to true if project is deployed and not under development so that only HTTPS requests can access the cookie
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: ENV.NODE_ENV === "development" ? false : true,
    });

    return token; // return the signed token
};