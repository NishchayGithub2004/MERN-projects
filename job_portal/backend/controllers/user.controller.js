import { User } from "../models/user.model.js"; // import the User model to interact with the users collection in the database
import bcrypt from "bcryptjs"; // import bcryptjs to hash and compare passwords securely
import jwt from "jsonwebtoken"; // import jsonwebtoken to generate and verify JWT tokens for authentication
import getDataUri from "../utils/datauri.js"; // import the getDataUri utility to convert uploaded files to data URIs
import cloudinary from "../utils/cloudinary.js"; // import the configured cloudinary instance to handle file uploads

export const register = async (req, res) => { // define an asynchronous function register to handle user registration
    try { // start a try block to handle errors during registration
        const { fullname, email, phoneNumber, password, role } = req.body; // extract user details from request body

        if (!fullname || !email || !phoneNumber || !password || !role) { // check if any required field is missing
            return res.status(400).json({ // return a 400 Bad Request response
                message: "Something is missing", // send an error message indicating missing fields
                success: false // indicate failure
            });
        }

        const file = req.file; // extract uploaded file from request object
        const fileUri = getDataUri(file); // convert the file to a data URI
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content); // upload the data URI content to Cloudinary

        const user = await User.findOne({ email }); // check if a user with the given email already exists

        if (user) { // if user exists
            return res.status(400).json({ // return a 400 Bad Request response
                message: 'User already exist with this email.', // send a message indicating duplicate email
                success: false // indicate failure
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // hash the password with 10 salt rounds

        await User.create({ // create a new user document in the database
            fullname, // set fullname
            email, // set email
            phoneNumber, // set phone number
            password: hashedPassword, // store hashed password
            role, // set user role
            profile: { // set profile subdocument
                profilePhoto: cloudResponse.secure_url, // store uploaded profile photo URL from Cloudinary
            }
        });

        return res.status(201).json({ // return a 201 Created response indicating successful registration
            message: "Account created successfully.", // send a success message
            success: true // indicate success
        });
    } catch (error) { // catch any errors thrown in the try block
        console.log(error); // log the error for debugging
    }
};

export const login = async (req, res) => { // define an asynchronous function login to handle user login
    try { // start a try block to handle errors
        const { email, password, role } = req.body; // extract login credentials and role from request body

        if (!email || !password || !role) { // check if any required field is missing
            return res.status(400).json({ // return a 400 Bad Request response
                message: "Something is missing", // send an error message
                success: false // indicate failure
            });
        }

        let user = await User.findOne({ email }); // find the user by email

        if (!user) { // if user does not exist
            return res.status(400).json({ // return a 400 Bad Request response
                message: "Incorrect email or password.", // send an error message
                success: false // indicate failure
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password); // compare provided password with hashed password

        if (!isPasswordMatch) { // if password does not match
            return res.status(400).json({ // return a 400 Bad Request response
                message: "Incorrect email or password.", // send an error message
                success: false // indicate failure
            });
        }

        if (role !== user.role) { // check if the provided role matches the user's role
            return res.status(400).json({ // return a 400 Bad Request response
                message: "Account doesn't exist with current role.", // send an error message
                success: false // indicate failure
            });
        }

        const tokenData = { userId: user._id }; // create payload for JWT containing user's ID

        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' }); // sign the JWT token with a 1-day expiry

        user = { // prepare user data to send in response without password
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({ // set JWT token as cookie and return 200 OK response
            message: `Welcome back ${user.fullname}`, // send a welcome message
            user, // include user details in response
            success: true // indicate success
        });
    } catch (error) { // catch any errors thrown in the try block
        console.log(error); // log the error for debugging
    }
};

export const logout = async (req, res) => { // define an asynchronous function logout to clear user session
    try { // start a try block to handle errors
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({ // clear the token cookie and return 200 OK response
            message: "Logged out successfully.", // send a success message
            success: true // indicate success
        });
    } catch (error) { // catch any errors thrown in the try block
        console.log(error); // log the error for debugging
    }
};

export const updateProfile = async (req, res) => { // define an asynchronous function updateProfile to update user's profile information
    try { // start a try block to handle errors
        const { fullname, email, phoneNumber, bio, skills } = req.body; // extract profile fields from request body

        const file = req.file; // extract uploaded file from request object
        const fileUri = getDataUri(file); // convert the file to a data URI
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content); // upload the data URI content to Cloudinary

        let skillsArray; // initialize variable to store skills as array

        if (skills) { // if skills are provided
            skillsArray = skills.split(","); // split comma-separated string into an array
        }

        const userId = req.id; // get authenticated user's ID from request

        let user = await User.findById(userId); // find the user by ID

        if (!user) { // if user does not exist
            return res.status(400).json({ // return a 400 Bad Request response
                message: "User not found.", // send an error message
                success: false // indicate failure
            });
        }

        if (fullname) user.fullname = fullname; // update fullname if provided
        if (email) user.email = email; // update email if provided
        if (phoneNumber) user.phoneNumber = phoneNumber; // update phone number if provided
        if (bio) user.profile.bio = bio; // update bio if provided
        if (skills) user.profile.skills = skillsArray; // update skills if provided

        if (cloudResponse) { // if a file was uploaded and uploaded to Cloudinary
            user.profile.resume = cloudResponse.secure_url; // store the file URL as resume
            user.profile.resumeOriginalName = file.originalname; // store the original file name
        }

        await user.save(); // save the updated user document to the database

        user = { // prepare user object to send in response without sensitive data
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({ // return a 200 OK response with updated user data
            message: "Profile updated successfully.", // send a success message
            user, // include updated user object
            success: true // indicate success
        });
    } catch (error) { // catch any errors thrown in the try block
        console.log(error); // log the error for debugging
    }
};
