import { Request, Response } from "express"; // import Request and Response types from express for typing
import { User } from "../models/user.model"; // import User model to interact with users collection
import bcrypt from "bcryptjs"; // import bcryptjs for hashing and comparing passwords
import crypto from "crypto"; // import crypto for cryptographic operations
import cloudinary from "../utils/cloudinary"; // import Cloudinary utility
import { generateVerificationCode } from "../utils/generateVerificationCode"; // import function to generate a verification code
import { generateToken } from "../utils/generateToken"; // import function to generate JWT token and set cookie
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email"; // import email utilities for sending different types of emails

export const signup = async (req: Request, res: Response) => { // define async function to register a new user
    try { // start try block to handle errors
        const { fullname, email, password, contact } = req.body; // destructure required fields from request body

        let user = await User.findOne({ email }); // check if a user with the given email already exists

        if (user) { // if user already exists
            return res.status(400).json({ // return HTTP 400
                success: false, // indicate failure
                message: "User already exist with this email" // provide descriptive message
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10); // hash the password with 10 salt rounds

        const verificationToken = generateVerificationCode(); // generate a verification token for email verification

        // create new user document in database and specify fields
        user = await User.create({
            fullname, // user's full name
            email, // user's email
            password: hashedPassword, // hashed password
            contact: Number(contact), // convert contact to number
            verificationToken, // verification token for email confirmation
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // set token expiry to 24 hours from now
        })

        generateToken(res, user); // generate JWT token and set it in cookie for authentication

        await sendVerificationEmail(email, verificationToken); // send verification email to user

        const userWithoutPassword = await User.findOne({ email }).select("-password"); // fetch user data without password

        return res.status(201).json({ // return HTTP 201 on successful signup
            success: true, // indicate success
            message: "Account created successfully", // provide success message
            user: userWithoutPassword // include user data without password
        });
    } catch (error) { // catch any errors
        console.log(error); // log error for debugging
        return res.status(500).json({ message: "Internal server error" }) // return generic HTTP 500 error
    }
}

export const login = async (req: Request, res: Response) => { // define async function for user login
    try { // start try block
        const { email, password } = req.body; // destructure email and password from request body

        const user = await User.findOne({ email }); // find user by email

        if (!user) { // if user does not exist
            return res.status(400).json({ // return HTTP 400
                success: false, // indicate failure
                message: "Incorrect email or password" // provide error message
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password); // compare provided password with stored hashed password

        if (!isPasswordMatch) { // if passwords do not match
            return res.status(400).json({ // return HTTP 400
                success: false, // indicate failure
                message: "Incorrect email or password" // provide error message
            });
        }

        generateToken(res, user); // generate JWT token and set cookie for authentication

        user.lastLogin = new Date(); // update last login timestamp

        await user.save(); // save updated user document

        const userWithoutPassword = await User.findOne({ email }).select("-password"); // fetch user data without password

        return res.status(200).json({ // return HTTP 200 on successful login
            success: true, // indicate success
            message: `Welcome back ${user.fullname}`, // personalized welcome message
            user: userWithoutPassword // include user data without password
        });
    } catch (error) { // catch any errors
        console.log(error); // log error for debugging
        return res.status(500).json({ message: "Internal server error" }) // return generic HTTP 500 error
    }
}

export const verifyEmail = async (req: Request, res: Response) => { // define async function to verify user email using a verification token
    try { // start try block
        const { verificationCode } = req.body; // extract verification code from request body

        const user = await User.findOne({ // find user with matching verification token that has not expired
            verificationToken: verificationCode,
            verificationTokenExpiresAt: { $gt: Date.now() }
        }).select("-password"); // exclude password field from returned user

        if (!user) { // check if user does not exist or token is invalid/expired
            return res.status(400).json({ // return HTTP 400
                success: false, // indicate failure
                message: "Invalid or expired verification token" // provide descriptive message
            });
        }

        // update user verification status and remove verification token fields
        user.isVerified = true; // mark user as verified
        user.verificationToken = undefined; // remove verification token
        user.verificationTokenExpiresAt = undefined; // remove token expiry

        await user.save(); // save updated user document

        await sendWelcomeEmail(user.email, user.fullname); // send welcome email after successful verification

        return res.status(200).json({ // return HTTP 200 on success
            success: true, // indicate success
            message: "Email verified successfully.", // provide success message
            user, // return updated user data
        })
    } catch (error) { // catch any errors
        console.log(error); // log error for debugging
        return res.status(500).json({ message: "Internal server error" }) // return generic HTTP 500 error
    }
}

export const logout = async (_: Request, res: Response) => { // define async function to log out user and clear authentication cookie
    try { // start try block
        return res.clearCookie("token").status(200).json({ // clear token cookie and return HTTP 200
            success: true, // indicate success
            message: "Logged out successfully." // provide success message
        });
    } catch (error) { // catch any errors
        console.log(error); // log error for debugging
        return res.status(500).json({ message: "Internal server error" }) // return generic HTTP 500 error
    }
}

export const forgotPassword = async (req: Request, res: Response) => { // define async function to initiate password reset
    try { // start try block
        const { email } = req.body; // extract email from request body

        const user = await User.findOne({ email }); // find user by email

        if (!user) { // check if user does not exist
            return res.status(400).json({ // return HTTP 400
                success: false, // indicate failure
                message: "User doesn't exist" // provide descriptive message
            });
        }

        const resetToken = crypto.randomBytes(40).toString('hex'); // generate a secure random token for password reset
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // set token expiry to 1 hour from now

        // assign reset token and expiry to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;

        await user.save(); // save updated user document

        await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`); // send password reset email with token link

        return res.status(200).json({ // return HTTP 200 on success
            success: true, // indicate success
            message: "Password reset link sent to your email" // provide descriptive message
        });
    } catch (error) { // catch any errors
        console.error(error); // log error for debugging
        return res.status(500).json({ message: "Internal server error" }); // return generic HTTP 500 error
    }
}

export const resetPassword = async (req: Request, res: Response) => { // define async function to reset password using a reset token
    try { // start try block
        const { token } = req.params; // extract reset token from URL parameters
        const { newPassword } = req.body; // extract new password from request body

        const user = await User.findOne({ // find user with matching reset token that has not expired
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) { // check if user does not exist or token is invalid/expired
            return res.status(400).json({ // return HTTP 400
                success: false, // indicate failure
                message: "Invalid or expired reset token" // provide descriptive message
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10); // hash the new password with 10 salt rounds

        // update user password and remove reset token fields
        user.password = hashedPassword; // set new hashed password
        user.resetPasswordToken = undefined; // remove reset token
        user.resetPasswordTokenExpiresAt = undefined; // remove token expiry

        await user.save(); // save updated user document

        await sendResetSuccessEmail(user.email); // send email confirming successful password reset

        return res.status(200).json({ // return HTTP 200 on success
            success: true, // indicate success
            message: "Password reset successfully." // provide success message
        });
    } catch (error) { // catch any errors
        console.error(error); // log error for debugging
        return res.status(500).json({ message: "Internal server error" }); // return generic HTTP 500 error
    }
}

export const checkAuth = async (req: Request, res: Response) => { // define async function to verify authenticated user
    try { // start try block
        const userId = (req as any).id; // extract user ID from request (assumes authentication middleware sets it)

        const user = await User.findById(userId).select("-password"); // find user by ID and exclude password field

        if (!user) { // check if user does not exist
            return res.status(404).json({ // return HTTP 404
                success: false, // indicate failure
                message: 'User not found' // provide descriptive message
            });
        };

        return res.status(200).json({ // return HTTP 200 if user exists
            success: true, // indicate success
            user // return user data without password
        });
    } catch (error) { // catch any errors
        console.error(error); // log error for debugging
        return res.status(500).json({ message: "Internal server error" }); // return generic HTTP 500 error
    }
}

export const updateProfile = async (req: Request, res: Response) => { // define async function to update user profile
    try { // start try block
        const userId = (req as any).id; // extract user ID from request (assumes authentication middleware sets it)

        const { fullname, email, address, city, country, profilePicture } = req.body; // destructure updated profile fields from request body

        let cloudResponse: any; // declare variable to store Cloudinary upload response

        cloudResponse = await cloudinary.uploader.upload(profilePicture); // upload new profile picture to Cloudinary

        const updatedData = { fullname, email, address, city, country, profilePicture }; // prepare updated user data object

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password"); // update user in database and return the updated document excluding password

        return res.status(200).json({ // return HTTP 200 on successful update
            success: true, // indicate success
            user, // return updated user data without password
            message: "Profile updated successfully" // provide success message
        });
    } catch (error) { // catch any errors
        console.error(error); // log error for debugging
        return res.status(500).json({ message: "Internal server error" }); // return generic HTTP 500 error
    }
}