import jwt from "jsonwebtoken"; // import the jsonwebtoken library to create and verify JWT tokens

export const generateToken = (res, user, message) => { // define a function generateToken that takes response object 'res', user object 'user', and a message string 'message' to generate and send a JWT token
    const token = jwt.sign( // call the sign() method from jsonwebtoken to create a new JWT token
        { userId: user._id }, // pass an object payload containing userId set to the _id property of the user object
        process.env.SECRET_KEY, // pass the secret key from environment variables to securely sign the token
        {
            expiresIn: "1d", // set the token to expire in 1 day by specifying the expiresIn option
        }
    );

    return res // use the response object to send a JSON response back to the client
        .status(200) // set the HTTP status code to 200 indicating a successful operation
        .cookie( // call the cookie() method to attach the generated token as a cookie in the response
            "token", // set the cookie name to 'token'
            token, // assign the generated token as the cookie value
            {
                httpOnly: true, // set httpOnly to true to prevent client-side scripts from accessing the cookie, improving security
                sameSite: "strict", // set sameSite to 'strict' to prevent the cookie from being sent on cross-site requests
                maxAge: 24 * 60 * 60 * 1000, // set the cookie's lifespan to 24 hours (in milliseconds)
            }
        ).json({ // send a JSON response to the client after setting the cookie
            success: true, // include a success property set to true indicating token generation succeeded
            message, // include the message argument to communicate additional info
            user // include the user object in the response to return user details
        });
};
