import { sendWelcomeEmail } from "../emails/emailHandlers.js"; // import sendWelcomeEmail to notify newly registered users with a welcome message
import { generateToken } from "../lib/utils.js"; // import generateToken to issue a jwt and attach it to the response after signup
import User from "../models/User.js"; // import the User model to create and query user records in the database
import bcrypt from "bcryptjs"; // import bcrypt to securely hash user passwords before storing them
import { ENV } from "../lib/env.js"; // import environment configuration to access client url and other runtime variables
import cloudinary from "../lib/cloudinary.js"; // import cloudinary client to handle user media uploads if needed in future

export const signup = async (req, res) => { // define a controller function to handle user registration requests
    const { fullName, email, password } = req.body; // extract required signup fields from the request body

    try { // wrap the signup flow in a try block to catch validation and database errors
        if (!fullName || !email || !password) return res.status(400).json({ message: "All fields are required" }); // validate that all required fields are provided

        if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" }); // enforce minimum password length for security

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // define a regex pattern to validate standard email formats
        
        if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format" }); // reject signup if email does not match expected format

        const user = await User.findOne({ email }); // check the database to see if a user with the same email already exists
        
        if (user) return res.status(400).json({ message: "Email already exists" }); // prevent duplicate accounts using the same email

        const salt = await bcrypt.genSalt(10); // generate a cryptographic salt to strengthen password hashing
        
        const hashedPassword = await bcrypt.hash(password, salt); // hash the plain-text password using the generated salt

        const newUser = new User({ // create a new User document with validated and processed data
            fullName, // assign the user's full name to the new record
            email, // assign the validated email address to the new record
            password: hashedPassword, // store the securely hashed password instead of plain text
        });

        if (newUser) { // ensure the user object was created successfully before proceeding
            const savedUser = await newUser.save(); // persist the new user record to the database
            
            generateToken(savedUser._id, res); // generate a jwt for the new user and set it as an http-only cookie

            res.status(201).json({ // send a successful signup response with non-sensitive user details
                _id: newUser._id, // return the unique identifier of the newly created user
                fullName: newUser.fullName, // return the user's full name for client-side use
                email: newUser.email, // return the user's email address for confirmation
                profilePic: newUser.profilePic, // return the profile picture reference if available
            });

            try { // attempt to send a welcome email without blocking the signup response
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL); // send a personalized welcome email with client link
            } catch (error) { // catch and log email delivery failures separately
                console.error("Failed to send welcome email:", error); // log email errors without affecting account creation
            }
        } else { // handle the unlikely case where user object creation fails
            res.status(400).json({ message: "Invalid user data" }); // return a client error indicating invalid signup input
        }
    } catch (error) { // catch unexpected errors during the signup process
        console.log("Error in signup controller:", error); // log the error for debugging and monitoring
        
        res.status(500).json({ message: "Internal server error" }); // return a generic server error response
    }
};

export const login = async (req, res) => { // define a controller function to authenticate an existing user and start a session
    const { email, password } = req.body; // extract login credentials from the request body

    if (!email || !password) return res.status(400).json({ message: "Email and password are required" }); // validate presence of both email and password before proceeding

    try { // wrap authentication logic in a try block to handle database and comparison errors
        const user = await User.findOne({ email }); // query the database to find a user matching the provided email
        
        if (!user) return res.status(400).json({ message: "Invalid credentials" }); // reject login if no matching user is found
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password); // compare provided password with the stored hashed password
        
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" }); // reject login if password comparison fails

        generateToken(user._id, res); // generate a jwt for the authenticated user and attach it to the response cookie

        res.status(200).json({ // return a successful login response with non-sensitive user information
            _id: user._id, // return the user's unique identifier for client-side reference
            fullName: user.fullName, // return the user's full name for display purposes
            email: user.email, // return the user's email address for client state
            profilePic: user.profilePic, // return the user's profile picture url if available
        });
    } catch (error) { // catch unexpected errors during authentication
        console.error("Error in login controller:", error); // log the error for debugging and monitoring        
        res.status(500).json({ message: "Internal server error" }); // return a generic server error response
    }
};

export const logout = (_, res) => { // define a controller function to terminate the user's authenticated session
    res.cookie("jwt", "", { maxAge: 0 }); // clear the jwt cookie by overwriting it with an expired value
    res.status(200).json({ message: "Logged out successfully" }); // confirm successful logout to the client
};

export const updateProfile = async (req, res) => { // define a controller function to update the authenticated user's profile data
    try { // wrap profile update logic in a try block to handle upload and database errors
        const { profilePic } = req.body; // extract the new profile picture data from the request body
        
        if (!profilePic) return res.status(400).json({ message: "Profile pic is required" }); // validate that profile picture data is provided

        const userId = req.user._id; // read the authenticated user's id from the request object set by auth middleware

        const uploadResponse = await cloudinary.uploader.upload(profilePic); // upload the profile picture to cloudinary and receive the hosted url

        const updatedUser = await User.findByIdAndUpdate(
            userId, // specify the user record to update using the authenticated user's id
            { profilePic: uploadResponse.secure_url }, // update the user's profile picture with the secure cloudinary url
            { new: true } // return the updated user document instead of the old one
        );

        res.status(200).json(updatedUser); // respond with the updated user object after successful profile update
    } catch (error) { // catch unexpected errors during profile update
        console.log("Error in update profile:", error); // log the error for debugging and operational visibility      
        res.status(500).json({ message: "Internal server error" }); // return a generic server error response
    }
};