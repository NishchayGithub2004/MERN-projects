import jwt from "jsonwebtoken"; // import the jsonwebtoken library to verify and decode JWT tokens

const isAuthenticated = async (req, res, next) => { // define an asynchronous middleware function isAuthenticated that takes request 'req', response 'res', and next function 'next' to verify user authentication
    try { // start a try block to handle potential errors during authentication
        const token = req.cookies.token; // access the 'token' cookie from the request object to retrieve the user's authentication token
        
        if (!token) { // check if the token does not exist
            return res.status(401).json({ // return a 401 Unauthorized response if the token is missing
                message: "User not authenticated", // include message indicating the user is not authenticated
                success: false, // set success flag to false
            });
        }
        
        const decode = jwt.verify( // call the verify() method from jsonwebtoken to decode and validate the token
            token, // pass the token extracted from cookies as the first argument
            process.env.SECRET_KEY // pass the secret key from environment variables to verify token authenticity
        );
        
        if (!decode) { // check if decoding failed or returned an invalid result
            return res.status(401).json({ // return a 401 Unauthorized response for an invalid token
                message: "Invalid token", // include message indicating invalid token
                success: false, // set success flag to false
            });
        }
        
        req.id = decode.userId; // assign the userId property from the decoded token to req.id to identify the authenticated user in subsequent middleware
        
        next(); // call the next() function to pass control to the next middleware or route handler
    } catch (error) { // catch block to handle errors during the token verification process
        console.log(error); // log the error to the console for debugging
    }
};

export default isAuthenticated; // export the isAuthenticated middleware as the default export for use in route protection
