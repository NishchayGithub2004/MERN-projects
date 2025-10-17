import { User } from "../models/user.model.js"; // import User model from user.model.js to interact with the user collection in MongoDB
import bcrypt from "bcryptjs"; // import bcrypt library to hash and compare passwords securely
import { generateToken } from "../utils/generateToken.js"; // import custom generateToken function to create JWT tokens for authentication
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js"; // import functions to handle media uploads and deletions from Cloudinary

export const register = async (req, res) => { // define an asynchronous function register to handle user registration using req and res objects
    try { // start try block to handle any runtime errors during registration
        const { name, email, password } = req.body; // destructure name, email, and password from the incoming request body to extract user input data

        if (!name || !email || !password) { // check if any of the required fields are missing by evaluating falsy values
            return res.status(400).json({ // return a 400 Bad Request response if any field is missing
                success: false, // set success to false to indicate failure
                message: "All fields are required." // provide an error message to inform the client about missing fields
            })
        }

        const user = await User.findOne({ email }); // query the User model to find if a user already exists with the provided email

        if (user) { // check if the user variable is truthy meaning user with the given email already exists
            return res.status(400).json({ // return a 400 Bad Request response if the user already exists
                success: false, // indicate failure
                message: "User already exist with this email." // send message informing that the email is already registered
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10); // hash the password using bcrypt with a salt round of 10 to securely store passwords

        await User.create({ // call create method of User model to insert new user data into the database
            name, // assign provided name to the new user document
            email, // assign provided email to the new user document
            password: hashedPassword // assign hashed password instead of plain text password for security
        });

        return res.status(201).json({ // send 201 Created response upon successful user creation
            success: true, // indicate successful operation
            message: "Account created successfully." // send confirmation message to the client
        })
    } catch (error) { // catch any errors that occur during registration
        console.log(error); // log the error details to the console for debugging

        return res.status(500).json({ // send 500 Internal Server Error response if registration fails unexpectedly
            success: false, // indicate failure
            message: "Failed to register" // provide a message describing the failure
        })
    }
}

export const login = async (req, res) => { // define an asynchronous function login to handle user authentication using req and res objects
    try { // start try block to handle potential runtime errors
        const { email, password } = req.body; // destructure email and password from the request body to extract login credentials

        if (!email || !password) { // check if either email or password is missing by evaluating falsy values
            return res.status(400).json({ // return 400 Bad Request response if any field is missing
                success: false, // indicate failure
                message: "All fields are required." // inform client that both fields are mandatory
            })
        }

        const user = await User.findOne({ email }); // search the User collection for a record matching the provided email

        if (!user) { // check if user does not exist meaning invalid email entered
            return res.status(400).json({ // return 400 Bad Request for invalid credentials
                success: false, // indicate failure
                message: "Incorrect email or password" // generic error message to maintain security
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password); // compare the entered password with stored hashed password using bcrypt compare method

        if (!isPasswordMatch) { // check if passwords do not match
            return res.status(400).json({ // return 400 Bad Request for incorrect credentials
                success: false, // indicate failure
                message: "Incorrect email or password" // same generic message for password mismatch
            });
        }

        generateToken( // call generateToken function to create JWT token and send successful login response
            res, // pass response object to set cookies or headers
            user, // pass authenticated user object to include user info in token
            `Welcome back ${user.name}` // pass success message personalized with user's name
        );
    } catch (error) { // catch any unexpected errors during login process
        console.log(error); // log error details for debugging

        return res.status(500).json({ // send 500 Internal Server Error if login fails unexpectedly
            success: false, // indicate failure
            message: "Failed to login" // provide message describing failure
        })
    }
}

export const logout = async (_, res) => { // define an asynchronous function logout to handle user logout, ignore first argument (_) since not used
    try { // start try block to handle logout process
        return res.status(200) // send 200 OK response for successful logout
            .cookie("token", "", { maxAge: 0 }) // clear authentication cookie named "token" by setting empty value and expiry 0
            .json({ // send JSON response after clearing cookie
                message: "Logged out successfully.", // success message to user
                success: true // indicate success
            })
    } catch (error) { // catch any unexpected errors during logout
        console.log(error); // log error for debugging

        return res.status(500).json({ // send 500 Internal Server Error if logout fails
            success: false, // indicate failure
            message: "Failed to logout" // describe failure in response
        })
    }
}

export const getUserProfile = async (req, res) => { // define an asynchronous function getUserProfile to fetch and return user profile details using req and res
    try { // start try block to handle runtime errors safely
        const userId = req.id; // extract userId from request object, which is usually attached by authentication middleware after token verification

        const user = await User.findById(userId) // query User model to find user by their unique MongoDB ID
            .select("-password") // exclude password field from query result using select method for security
            .populate("enrolledCourses"); // populate enrolledCourses field to replace course IDs with actual course documents

        if (!user) { // check if no user document is found for the given ID
            return res.status(404).json({ // return 404 Not Found response when profile doesn't exist
                message: "Profile not found", // provide message indicating missing profile
                success: false // indicate failure in response
            })
        }

        return res.status(200).json({ // send 200 OK response for successful retrieval
            success: true, // indicate success
            user // send user profile data (excluding password) in response
        })
    } catch (error) { // catch block to handle exceptions during execution
        console.log(error); // log error details for debugging purposes

        return res.status(500).json({ // send 500 Internal Server Error response if fetching profile fails
            success: false, // indicate failure
            message: "Failed to load user" // provide failure message for client-side handling
        })
    }
}

export const updateProfile = async (req, res) => { // define an asynchronous function updateProfile to handle user profile updates using req and res
    try { // start try block to safely handle possible runtime errors
        const userId = req.id; // extract userId from the request object, usually set by authentication middleware
        const { name } = req.body; // destructure name field from request body to get updated name
        const profilePhoto = req.file; // extract uploaded profile photo from request object handled by multer

        const user = await User.findById(userId); // query User model to find user document by its MongoDB ID

        if (!user) { // check if user is not found in database
            return res.status(404).json({ // return 404 Not Found response if user does not exist
                message: "User not found", // provide message to inform client
                success: false // indicate failure
            })
        }

        if (user.photoUrl) { // check if user already has a profile photo URL stored
            const publicId = user.photoUrl.split("/").pop().split(".")[0]; // extract Cloudinary public ID from photo URL by splitting the string
            deleteMediaFromCloudinary(publicId); // call deleteMediaFromCloudinary function to remove old profile photo from Cloudinary using extracted ID
        }

        const cloudResponse = await uploadMedia(profilePhoto.path); // upload new profile photo to Cloudinary using its local file path and store upload response

        const photoUrl = cloudResponse.secure_url; // extract secure URL of uploaded image from Cloudinary response to store in database

        const updatedData = { name, photoUrl }; // create an object containing fields to be updated: new name and new photo URL

        const updatedUser = await User.findByIdAndUpdate( // call findByIdAndUpdate method to modify user document with new data
            userId, // pass ID of user to be updated
            updatedData, // pass object with updated name and photoUrl fields
            { new: true } // use { new: true } option to return updated document instead of old one
        ).select("-password"); // exclude password field from returned user object for security

        return res.status(200).json({ // send 200 OK response upon successful update
            success: true, // indicate success
            user: updatedUser, // include updated user data in response
            message: "Profile updated successfully." // send success message to client
        })
    } catch (error) { // catch any unexpected errors that occur during execution
        console.log(error); // log error details for debugging

        return res.status(500).json({ // send 500 Internal Server Error response in case of failure
            success: false, // indicate failure
            message: "Failed to update profile" // describe error message for client
        })
    }
}