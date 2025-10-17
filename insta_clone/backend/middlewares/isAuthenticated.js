import jwt from "jsonwebtoken"; // import the jsonwebtoken library to handle creation and verification of JWT tokens

const isAuthenticated = async ( // define an asynchronous middleware function named isAuthenticated to verify user authentication
    req, // represents the incoming HTTP request object containing client data like headers, cookies, and body
    res, // represents the HTTP response object used to send responses back to the client
    next // represents a callback function that passes control to the next middleware or route handler
) => {
    try { // start a try block to handle potential errors during authentication
        const token = req.cookies.token; // extract the token value from cookies of the incoming request using the key 'token'
        
        if (!token) { // check if the token is missing in the cookies
            return res.status(401).json({ // return a 401 (Unauthorized) response as JSON to indicate the user is not authenticated
                message: 'User not authenticated', // send a message describing the issue
                success: false // indicate failure in the response
            });
        }
        
        const decode = jwt.verify( // verify and decode the JWT token to check its validity
            token, // the JWT token extracted from cookies that needs to be verified
            process.env.SECRET_KEY // the secret key from environment variables used to verify the token’s signature
        );
        
        if (!decode) { // check if the decoding failed (token invalid or verification unsuccessful)
            return res.status(401).json({ // return a 401 response if the token could not be verified
                message: 'Invalid', // specify the token was invalid
                success: false // indicate the verification failure
            });
        }
        
        req.id = decode.userId; // assign the userId extracted from the decoded token to the request object for downstream use
        
        next(); // call the next middleware or route handler in the chain since authentication succeeded
    } catch (error) { // handle any runtime or verification errors
        console.log(error); // log the error to the console for debugging
    }
}

export default isAuthenticated; // export the isAuthenticated middleware as the default export for use in route protection
