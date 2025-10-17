import { User } from "../models/user.model.js"; // import the User model to handle user data operations in MongoDB
import bcrypt from "bcryptjs"; // import bcryptjs to hash passwords securely before saving them
import jwt from "jsonwebtoken"; // import jsonwebtoken for future authentication token management
import getDataUri from "../utils/datauri.js"; // import helper function to convert uploaded files to data URIs for cloud upload
import cloudinary from "../utils/cloudinary.js"; // import configured cloudinary instance for image uploads
import { Post } from "../models/post.model.js"; // import the Post model for possible post-related operations in user routes

export const register = async ( // define an asynchronous function named register to handle user registration
    req, // represents the HTTP request object containing form data (username, email, password)
    res // represents the HTTP response object used to send back registration results
) => {
    try { // start a try block to catch and handle any runtime or database errors
        const { username, email, password } = req.body; // destructure username, email, and password fields from the request body
        
        if (!username || !email || !password) { // check if any of the required fields are missing
            return res.status(401).json({ // return a 401 (Unauthorized) response if validation fails
                message: "Something is missing, please check!", // provide a descriptive error message
                success: false, // indicate that the operation failed
            });
        }
        
        const user = await User.findOne({ email }); // search the database for an existing user with the same email
        
        if (user) { // check if a user with the given email already exists
            return res.status(401).json({ // return a 401 response to indicate the email is already taken
                message: "Try different email", // provide a message suggesting the user use a different email
                success: false, // indicate that registration failed
            });
        };
        
        const hashedPassword = await bcrypt.hash( // hash the user's password to securely store it in the database
            password, // the plain text password input by the user
            10 // the number of salt rounds used by bcrypt to strengthen the hash
        );
        
        await User.create({ // create a new user document in the database
            username, // store the username provided in the request
            email, // store the email provided by the user
            password: hashedPassword // store the securely hashed password instead of the plain text
        });
        
        return res.status(201).json({ // send a 201 (Created) HTTP response to confirm successful registration
            message: "Account created successfully.", // provide a success message for the client
            success: true, // indicate that the operation was successful
        });
    } catch (error) { // handle any unexpected errors during registration
        console.log(error); // log the error to the console for debugging purposes
    }
};

export const login = async ( // define an asynchronous function named login to handle user authentication
    req, // represents the HTTP request object containing email and password in the body
    res // represents the HTTP response object used to send login results or errors
) => {
    try { // start a try block to safely handle errors
        const { email, password } = req.body; // destructure email and password fields from the request body
        
        if (!email || !password) { // check if either email or password is missing
            return res.status(401).json({ // return a 401 (Unauthorized) response if validation fails
                message: "Something is missing, please check!", // provide a descriptive error message
                success: false, // indicate the operation failed
            });
        }
        
        let user = await User.findOne({ email }); // search the database for a user with the provided email
        
        if (!user) { // check if no user with the given email exists
            return res.status(401).json({ // return a 401 response indicating invalid credentials
                message: "Incorrect email or password", // specify that credentials are invalid
                success: false, // indicate login failure
            });
        }
        
        const isPasswordMatch = await bcrypt.compare( // compare the entered password with the hashed password in the database
            password, // the plain text password entered by the user
            user.password // the hashed password stored in the database
        );
        
        if (!isPasswordMatch) { // check if password verification failed
            return res.status(401).json({ // return a 401 response if the password is incorrect
                message: "Incorrect email or password", // send a general invalid credential message
                success: false, // indicate login failure
            });
        };

        const token = jwt.sign( // generate a JWT token for the authenticated user
            { userId: user._id }, // the payload containing the user's unique ID
            process.env.SECRET_KEY, // the secret key used to sign the token for security
            { expiresIn: '1d' } // set the token to expire in one day for session control
        );

        const populatedPosts = await Promise.all( // concurrently fetch and verify all posts created by the user
            user.posts.map( // iterate over each post ID stored in the user's posts array
                async (postId) => { // define an asynchronous callback function for each post ID
                    const post = await Post.findById(postId); // retrieve the post document from the database using its ID
                    if (post.author.equals(user._id)) { // check if the post author matches the current user ID
                        return post; // return the post if the author is valid
                    }
                    return null; // return null if the post does not belong to the user
                }
            )
        );

        user = { // redefine the user object to send only necessary fields in the response
            _id: user._id, // include the user's unique MongoDB ID
            username: user.username, // include the user's username
            email: user.email, // include the user's email address
            profilePicture: user.profilePicture, // include the user's profile image
            bio: user.bio, // include the user's bio
            followers: user.followers, // include the user's list of followers
            following: user.following, // include the user's list of followed accounts
            posts: populatedPosts // include the populated posts array after validation
        };
        
        return res.cookie( // set a secure cookie in the user's browser containing the JWT token
            'token', // the cookie name
            token, // the JWT token value
            { // define additional cookie options for security
                httpOnly: true, // make the cookie inaccessible to JavaScript on the client side
                sameSite: 'strict', // restrict cross-site cookie access to prevent CSRF attacks
                maxAge: 1 * 24 * 60 * 60 * 1000 // set cookie expiration to 1 day in milliseconds
            }
        ).json({ // send a JSON response back to the client
            message: `Welcome back ${user.username}`, // personalized welcome message for the user
            success: true, // indicate login success
            user // include the sanitized user data object in the response
        });
    } catch (error) { // handle any unexpected runtime or database errors
        console.log(error); // log the error details to the console for debugging
    }
};

export const logout = async ( // define an asynchronous function named logout to handle user logout
    _, // ignore the request object since it is not needed for this operation
    res // represents the HTTP response object used to clear the authentication cookie
) => {
    try { // start a try block to handle any potential errors during logout
        return res.cookie( // clear the authentication token by resetting the cookie
            "token", // specify the cookie name to clear
            "", // set the cookie value to an empty string to remove it
            { maxAge: 0 } // immediately expire the cookie by setting its lifetime to 0
        ).json({ // send a JSON response to confirm successful logout
            message: 'Logged out successfully.', // provide a confirmation message
            success: true // indicate that the logout operation was successful
        });
    } catch (error) { // handle unexpected errors during logout
        console.log(error); // log the error to the console for debugging
    }
};

export const getProfile = async ( // define an asynchronous function named getProfile to fetch a user's profile data
    req, // represents the HTTP request object containing parameters like user ID
    res // represents the HTTP response object used to send the retrieved user data or errors
) => {
    try { // start a try block to handle any potential runtime or database errors
        const userId = req.params.id; // extract the user ID from the request parameters
        
        let user = await User.findById(userId) // query the database to find the user document by its unique ID
            .populate({ // populate the user's posts field with detailed post documents
                path: 'posts', // specify that we want to populate the 'posts' field
                createdAt: -1 // (intended to sort posts by creation date, but misplaced; should be inside 'options')
            })
            .populate('bookmarks'); // populate the user's bookmarks with the referenced post documents
        
        return res.status(200).json({ // send a successful HTTP response containing the user data
            user, // include the user object with populated fields in the response
            success: true // indicate that the profile retrieval was successful
        });
    } catch (error) { // catch any unexpected errors during execution
        console.log(error); // log the error details to the console for debugging
    }
};

export const editProfile = async ( // define an asynchronous function named editProfile to update user profile details
    req, // represents the HTTP request object containing body data, files, and the authenticated user ID
    res // represents the HTTP response object used to send the result of profile editing
) => {
    try { // start a try block to handle potential errors during profile editing
        const userId = req.id; // extract the authenticated user's ID from the request (set during auth middleware)
        
        const { bio, gender } = req.body; // destructure bio and gender fields from the request body
        
        const profilePicture = req.file; // extract the uploaded profile picture file from the request (if any)
        
        let cloudResponse; // declare a variable to store the Cloudinary upload response

        if (profilePicture) { // check if a new profile picture was uploaded
            const fileUri = getDataUri(profilePicture); // convert the uploaded file to a Data URI format using a utility function
            cloudResponse = await cloudinary.uploader.upload(fileUri); // upload the file to Cloudinary and store the response
        }

        const user = await User.findById(userId).select('-password'); // retrieve the user from the database excluding the password field
        
        if (!user) { // check if no user was found for the provided ID
            return res.status(404).json({ // return a 404 response indicating the user does not exist
                message: 'User not found.', // specify the reason for failure
                success: false // indicate the operation was unsuccessful
            });
        };
        
        if (bio) user.bio = bio; // update the user's bio if provided in the request body
        
        if (gender) user.gender = gender; // update the user's gender if provided
        
        if (profilePicture) user.profilePicture = cloudResponse.secure_url; // update the user's profile picture with the new Cloudinary URL

        await user.save(); // save the updated user document back to the database

        return res.status(200).json({ // send a successful response after updating the profile
            message: 'Profile updated.', // notify that the update was successful
            success: true, // indicate success status
            user // include the updated user object in the response
        });
    } catch (error) { // handle any unexpected runtime or database errors
        console.log(error); // log the error for debugging
    }
};

export const getSuggestedUsers = async ( // define an asynchronous function named getSuggestedUsers to fetch user suggestions
    req, // represents the HTTP request object containing the authenticated user's ID
    res // represents the HTTP response object used to send data or errors
) => {
    try { // start a try block to handle any potential runtime errors
        const suggestedUsers = await User.find({ // query the database to find users for suggestion
            _id: { $ne: req.id } // use MongoDB's $ne operator to exclude the currently logged-in user's ID
        }).select("-password"); // exclude the password field from the query results for security
        
        if (!suggestedUsers) { // check if no suggested users were found
            return res.status(400).json({ // send a 400 Bad Request response
                message: 'Currently do not have any users', // specify reason for the failure
            });
        };
        
        return res.status(200).json({ // send a success response with the list of suggested users
            success: true, // indicate successful operation
            users: suggestedUsers // return the suggested users list
        });
    } catch (error) { // handle any unexpected database or runtime errors
        console.log(error); // log the error for debugging
    }
};

export const followOrUnfollow = async ( // define an asynchronous function named followOrUnfollow to toggle following state between users
    req, // represents the HTTP request object containing user IDs
    res // represents the HTTP response object used to send back operation results
) => {
    try { // start a try block for error handling
        const followKrneWala = req.id; // extract the ID of the currently authenticated user (the one performing follow/unfollow)
        
        const jiskoFollowKrunga = req.params.id; // extract the target user ID from URL parameters (the one being followed/unfollowed)
        
        if (followKrneWala === jiskoFollowKrunga) { // check if the user is trying to follow themselves
            return res.status(400).json({ // send an error response if self-following is attempted
                message: 'You cannot follow/unfollow yourself', // specify reason for rejection
                success: false // indicate unsuccessful operation
            });
        }

        const user = await User.findById(followKrneWala); // fetch the follower user's document from the database
        
        const targetUser = await User.findById(jiskoFollowKrunga); // fetch the target user's document from the database

        if (!user || !targetUser) { // check if either user doesn't exist
            return res.status(400).json({ // send an error response if either user is missing
                message: 'User not found', // specify reason
                success: false // indicate failure
            });
        }
        
        const isFollowing = user.following.includes(jiskoFollowKrunga); // check if the current user is already following the target user
        
        if (isFollowing) { // if the user is already following, perform an unfollow action
            await Promise.all([ // run both database updates concurrently using Promise.all
                User.updateOne( // update the follower's document
                    { _id: followKrneWala }, // find the follower user by ID
                    { $pull: { following: jiskoFollowKrunga } } // remove the target user's ID from their following list
                ),
                User.updateOne( // update the target user's document
                    { _id: jiskoFollowKrunga }, // find the target user by ID
                    { $pull: { followers: followKrneWala } } // remove the follower's ID from their followers list
                ),
            ]);

            return res.status(200).json({ // send a success response after unfollowing
                message: 'Unfollowed successfully', // confirmation message
                success: true // indicate success
            });
        } else { // if not already following, perform a follow action
            await Promise.all([ // execute both updates simultaneously for efficiency
                User.updateOne( // update the follower user's document
                    { _id: followKrneWala }, // find the follower user by ID
                    { $push: { following: jiskoFollowKrunga } } // add the target user's ID to their following list
                ),
                User.updateOne( // update the target user's document
                    { _id: jiskoFollowKrunga }, // find the target user by ID
                    { $push: { followers: followKrneWala } } // add the follower's ID to their followers list
                ),
            ]);
            
            return res.status(200).json({ // send a success response after following
                message: 'followed successfully', // confirmation message
                success: true // indicate success
            });
        }
    } catch (error) { // catch any errors that occur during database operations
        console.log(error); // log the error for debugging
    }
};
