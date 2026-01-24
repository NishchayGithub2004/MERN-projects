import bcrypt from "bcrypt"; // import bcrypt library to hash and compare passwords securely
import jwt from "jsonwebtoken"; // import jsonwebtoken library to generate and verify JWT tokens
import User from "../../models/User"; // import User model from models folder to interact with User collection in database

const SECRET_KEY = process.env.CLIENT_SECRET_KEY; // get JWT secret key from environment variables to sign tokens

const registerUser = async (req, res) => { // define async function registerUser with req (request object) and res (response object) as arguments
    const { userName, email, password } = req.body; // extract userName, email, and password from request body using object destructuring

    try { // start try block to handle potential errors
        const checkUser = await User.findOne({ email }); // search database for existing user with same email asynchronously and store in checkUser
        
        if (checkUser) // check if user with same email already exists
            return res.json({ // send JSON response and exit function if user exists
                success: false, // indicate operation failed
                message: "User Already exists with the same email! Please try again", // include message for duplicate user
            });

        const hashPassword = await bcrypt.hash(password, 12); // hash the received password asynchronously with salt rounds of 12 and store in hashPassword
        
        const newUser = new User({ // create new instance of User model with provided details
            userName, // assign userName to newUser
            email, // assign email to newUser
            password: hashPassword, // assign hashed password to newUser
        });

        await newUser.save(); // save the newUser document to database asynchronously
        
        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            message: "Registration successful", // include success message
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log error to console for debugging
        
        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Some error occured", // include generic error message
        });
    }
};

const loginUser = async (req, res) => { // define async function loginUser with req (request object) and res (response object) as arguments
    const { email, password } = req.body; // extract email and password from request body using object destructuring

    try { // start try block to handle potential errors
        const checkUser = await User.findOne({ email }); // search database for user with provided email asynchronously and store in checkUser
        
        if (!checkUser) // check if user does not exist
            return res.json({ // send JSON response and exit function if user not found
                success: false, // indicate operation failed
                message: "User doesn't exists! Please register first", // include message for non-existent user
            });

        const checkPasswordMatch = await bcrypt.compare( // compare provided password with stored hashed password asynchronously
            password, // plaintext password received from request
            checkUser.password // hashed password stored in database
        );
        
        if (!checkPasswordMatch) // check if passwords do not match
            return res.json({ // send JSON response and exit function if password is incorrect
                success: false, // indicate operation failed
                message: "Incorrect password! Please try again", // include message for incorrect password
            });

        const token = jwt.sign( // generate JWT token with payload, secret key, and options
            {
                id: checkUser._id, // include user id in token payload
                role: checkUser.role, // include user role in token payload
                email: checkUser.email, // include email in token payload
                userName: checkUser.userName, // include userName in token payload
            },
            SECRET_KEY, // use secret key to sign the token
            { expiresIn: "60m" } // set token expiration to 60 minutes
        );

        res.cookie("token", token, { httpOnly: true, secure: false }).json({ // set token as HTTP-only cookie and send JSON response
            success: true, // indicate operation was successful
            message: "Logged in successfully", // include success message
            user: { // include user details in response
                email: checkUser.email, // include user email
                role: checkUser.role, // include user role
                id: checkUser._id, // include user id
                userName: checkUser.userName, // include userName
            },
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log error to console for debugging
        
        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Some error occured", // include generic error message
        });
    }
};

const logoutUser = (_, res) => { // define function logoutUser with ignored first argument (_) and res (response object)
    res.clearCookie("token").json({ // clear token cookie from client and send JSON response
        success: true, // indicate operation was successful
        message: "Logged out successfully!", // include logout success message
    });
};

const authMiddleware = async (req, res, next) => { // define async middleware function authMiddleware with req, res, and next function as arguments
    const token = req.cookies.token; // get token from request cookies
    
    if (!token) // check if token does not exist
        return res.status(401).json({ // send response with status 401 (unauthorized) if token is missing
            success: false, // indicate operation failed
            message: "Unauthorised user!", // include unauthorized message
        });

    try { // start try block to handle potential errors
        const decoded = jwt.verify(token, SECRET_KEY); // verify JWT token using secret key and store decoded payload
        req.user = decoded; // attach decoded user payload to request object for further use
        next(); // call next middleware function in request-response cycle
    } catch (error) { // catch error if token verification fails
        res.status(401).json({ // send response with status 401 (unauthorized) if token is invalid
            success: false, // indicate operation failed
            message: "Unauthorised user!", // include unauthorized message
        });
    }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware }; // export all functions as named exports
