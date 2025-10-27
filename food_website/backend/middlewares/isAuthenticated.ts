import { NextFunction, Request, Response } from "express"; // import data types of request and response objects and next function that passes control to next middleware or function in line
import jwt from "jsonwebtoken"; // import jsonwebtoken library for generating and verifying tokens for authentication

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => { // create an async function to check if user is authenticated
    // it takes in request and response objects, and 'next' function as parameters
    try {
        const token = req.cookies.token; // get value of token from cookies in request object
        
        if (!token) { // if token is not present or found
            return res.status(401).json({ // return a 401 status code with a JSON response with following properties
                success: false, // indicating that user is not authenticated
                message: "User not authenticated" // with a message indicating that user is not authenticated
            });
        }
        
        const decode = jwt.verify(token, process.env.SECRET_KEY!) as jwt.JwtPayload; // decode and verify JSON web token coming from request with secret key, if they match, it means request came from authenticated source
        
        if (!decode) { // if 'decoded' ie decoded token is undefined or null, it means token is invalid ie came from unauthorized source or was tampered
            return res.status(401).json({ // return a 401 status code with a JSON response with following properties
                success: false, // indicating that authentication was not successful
                message: "Invalid token" // with a message indicating that token is invalid
            })
        }
        
        (req as any).id = decode.userId; // set 'id' property of request object to decoded user ID from token
        
        next(); // pass the control to next middleware or function in line
    } catch (error) { // if any error occurs during execution of function
        return res.status(500).json({ // return a 500 status code with a JSON response
            message: "Internal server error" // return a message in JSON that there was an internal server error
        })
    }
}