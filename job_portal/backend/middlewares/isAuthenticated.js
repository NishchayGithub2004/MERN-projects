import jwt from "jsonwebtoken"; // import the jsonwebtoken library to handle creation and verification of JWT tokens

const isAuthenticated = async (req, res, next) => { // define an asynchronous middleware function isAuthenticated to verify if a user is authenticated based on a JWT token
    try { // start a try block to handle potential runtime errors
        const token = req.cookies.token; // extract the JWT token from the cookies of the incoming request object for authentication

        if (!token) { // check if the token does not exist
            return res.status(401).json({ // return a 401 Unauthorized response if there is no token
                message: "User not authenticated", // send a message stating that the user is not authenticated
                success: false, // set success to false to indicate the failure of authentication
            });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY); // verify the token using jwt.verify with the token string and the secret key from environment variables, and store the decoded payload

        if (!decode) { // check if decoding failed or returned null
            return res.status(401).json({ // return a 401 Unauthorized response for an invalid token
                message: "Invalid token", // send a message indicating that the provided token is invalid
                success: false // set success to false to indicate verification failure
            });
        }
        
        req.id = decode.userId; // assign the userId extracted from the decoded token payload to req.id to make it accessible in subsequent middleware or routes
        
        next(); // call the next function to pass control to the next middleware or route handler
    } catch (error) { // start a catch block to handle errors thrown in the try block
        console.log(error); // log the error to the console for debugging purposes
    }
}

export default isAuthenticated; // export the isAuthenticated middleware function as the default export for use in route protection
