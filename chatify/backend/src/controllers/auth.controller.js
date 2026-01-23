import { sendWelcomeEmail } from "../emails/emailHandlers.js"; // import 'sendWelcomeEmail' function from 'emailHandlers.js' file in 'emails' folder
// to send a welcome email to the user after they sign up
import { generateToken } from "../lib/utils.js"; // import 'generateToken' function from 'utils.js' file in 'lib' folder to generate a JWT token for
// new user for future authentication when they make requests to the backend
import User from "../models/User.js";
import bcrypt from "bcryptjs"; // import 'bcrypt' object from 'bcryptjs' library to encrypt user's password before storing it in the database
import { ENV } from "../lib/env.js"; // import 'ENV' object from 'env.js' file in 'lib' folder to access and use environment variables
import cloudinary from "../lib/cloudinary.js"; // import 'cloudinary' object from 'cloudinary.js' file in 'lib' folder to upload user's profile picture to cloudinary's cloud server

export const signup = async (req, res) => { // create a function named 'signup' to register a new user in the database
    // it takes user's request to register and backend's response to the request, both as objects
    const { fullName, email, password } = req.body; // extract new user's full name, email and password from request body

    try {
        if (!fullName || !email || !password) return res.status(400).json({ message: "All fields are required" });
        // if user didn't provide all the three details, return a 400 status code with a JSON message indicating that all fields are required

        if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
        // if the password provided by the user is less than 6 characters, return a 400 status code with a JSON message indicating that the password must be at least 6 characters

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // create a regular expression to validate email format
        
        if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format" });
        // if the email provided by the user doesn't match the email format specified by the regular expression, return a 400 status code with a JSON message indicating that the email format is invalid

        const user = await User.findOne({ email }); // find the user in the database with the same email as the one provided by the user
        
        if (user) return res.status(400).json({ message: "Email already exists" });
        // if such an email is found in the database, return a 400 status code with a JSON message indicating that the email already exists
        // it means that user is already registered with this email in the database

        const salt = await bcrypt.genSalt(10); // encrypt the user's password using 'bcrypt' object's 'genSalt' function with a salt factor of 10
        // the more the salt factor is, the more secure the encrypted password will be but also the more time it will take to encrypt the password
        
        const hashedPassword = await bcrypt.hash(password, salt); // encrypt the user's password using 'bcrypt' object's 'hash' function with the salt generated previously

        const newUser = new User({ fullName, email, password: hashedPassword }); // insert the new user's details (full name, email and encrypted password) in 'User' collection of the database

        if (newUser) { // if new user is successfully created in the database's 'User' collection
            const savedUser = await newUser.save(); // save the new user's details in the database
            
            generateToken(savedUser._id, res); // generate a JWT token for the new user using 'generateToken' function and put it in the backend's response object

            // return a 201 status code with a JSON message containing new user's unique ID, full name, email and profile picture
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
                // send a welcome email to the new user's email containing it's name also from the email address stored in 'CLIENT_URL' property of 'ENV' object
            } catch (error) { // if any error occurs while sending the email to the new user
                console.error("Failed to send welcome email:", error); // log the error to the console to know what error occured
            }
        } else {
            res.status(400).json({ message: "Invalid user data" }); // if new user is not created in the database's 'User' collection, return a 400 status code with a JSON message 
            // indicating that the user data is invalid so it could not be registered in the database
        }
    } catch (error) { // if any error occurs while registering the new user in the database
        console.error("Error occured during signup: ", error); // log the error to the console to know what error occured
        res.status(500).json({ message: "Internal server error" }); // return a 500 status code with a JSON message indicating that an internal server error occured
    }
};

export const login = async (req, res) => { // create a function named 'login' to login an existing user in the database to the app
    // it takes user's request to login and backend's response to the request, both as objects
    const { email, password } = req.body; // extract user's email and password from request body

    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    // if user didn't provide email and password, return a 400 status code with a JSON message indicating that email and password are required to be given

    try {
        const user = await User.findOne({ email }); // find the user in the database with the same email as the one provided by the user
        
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        // if such an email is not found in the database, return a 400 status code with a JSON message indicating that the credentials are invalid
        // it means that user is not registered with this email in the database so he can't login with this email and password

        const isPasswordCorrect = await bcrypt.compare(password, user.password); // check if the password provided by the user matches the decrypted password stored in the database for this user
        
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
        // if the password provided by the user doesn't match the decrypted password stored in the database for this user, return a 400 status code with a JSON message indicating that the credentials are invalid
        // it means that user is registered with this email in the database but it provided a wrong password to login with

        generateToken(user._id, res); // generate a new JWT token for the user using 'generateToken' function and put it in the backend's response object

        // return a 200 status code with a JSON message containing user's unique ID, full name, email and profile picture
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) { // if any error occurs while logging in the user in the database
        console.error("Error occured during login: ", error); // log the error to the console to know what error occured
        res.status(500).json({ message: "Internal server error" }); // return a 500 status code with a JSON message indicating that an internal server error occured
    }
};

export const logout = (_, res) => { // create a function named 'logout' to logout an existing user from the app, it only takes backend's response to the request as an object
    // it doesn't take user's request to logout as object because it's not needed to logout the user from the app, it's enough to clear the JWT token from the backend's response object
    res.cookie("jwt", "", { maxAge: 0 }); // clear the JWT token from the backend's response object by setting it to an empty string and setting it's max age to 0
    res.status(200).json({ message: "Logged out successfully" }); // return a 200 status code with a JSON message indicating that the user has been logged out successfully
};

export const updateProfile = async (req, res) => { // create a function named 'updateProfile' to update an existing user's profile picture in the database
    // it takes user's request to update it's profile and backend's response to the request, both as objects
    try {
        const { profilePic } = req.body; // extract user's profile picture from request body
        
        if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });
        // if user didn't provide profile picture, return a 400 status code with a JSON message indicating that new profile picture is required to be given

        const userId = req.user._id; // get user's unique ID from the request object's 'user' property to know which user's profile picture is to be updated

        const uploadResponse = await cloudinary.uploader.upload(profilePic); // upload the user's new profile picture to cloudinary's cloud server using 'cloudinary' object's 'uploader' function's 'upload' method

        // find the user in the database with the same unique ID as the one present in the request object's 'user' property and update it's profile picture with the new profile picture's cloudinary URL
        // set the 'new' option to 'true' to return the updated user's details instead of the old user's details
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser); // return a 200 status code with a JSON message containing the updated user's details
    } catch (error) { // if any error occurs while updating the user's profile picture in the database
        console.log("Error occured while updating profile picture: ", error); // log the error to the console to know what error occured
        res.status(500).json({ message: "Internal server error" }); // return a 500 status code with a JSON message indicating that an internal server error occured
    }
};