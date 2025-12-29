import jwt from "jsonwebtoken"; // import jsonwebtoken to create and sign JWTs for user authentication
import { ENV } from "./env.js"; // import environment configuration to access secret keys and runtime settings

export const generateToken = (userId, res) => { // define a function to generate a JWT for a user and attach it to the response as a cookie
    const { JWT_SECRET } = ENV; // extract the JWT secret from environment variables for signing the token
    
    if (!JWT_SECRET) { // validate that the JWT secret is configured before attempting token generation
        throw new Error("JWT_SECRET is not configured"); // throw an explicit error to prevent issuing unsigned or insecure tokens
    }

    const token = jwt.sign({ userId }, JWT_SECRET, { // create a signed JWT containing the user id as the payload
        expiresIn: "7d", // set the token to expire after seven days to limit long-term misuse
    });

    res.cookie("jwt", token, { // attach the JWT to an HTTP-only cookie so it is sent automatically with client requests
        maxAge: 7 * 24 * 60 * 60 * 1000, // define the cookie lifetime to match the token expiration period
        httpOnly: true, // prevent client-side JavaScript access to the cookie to reduce XSS risk
        sameSite: "strict", // restrict the cookie to same-site requests to mitigate CSRF attacks
        secure: ENV.NODE_ENV === "development" ? false : true, // enable secure cookies in non-development environments to enforce HTTPS
    });

    return token; // return the generated token
};