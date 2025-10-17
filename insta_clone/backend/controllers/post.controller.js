import sharp from "sharp"; // import the sharp library to perform image optimization and resizing
import cloudinary from "../utils/cloudinary.js"; // import the Cloudinary utility to handle image uploads to the cloud
import { Post } from "../models/post.model.js"; // import the Post model to interact with the posts collection in MongoDB
import { User } from "../models/user.model.js"; // import the User model to update user data when they create posts
import { Comment } from "../models/comment.model.js"; // import the Comment model (used for post-comment relationships)
import { getReceiverSocketId, io } from "../socket/socket.js"; // import socket utilities to handle real-time communication

export const addNewPost = async ( // define an asynchronous function named addNewPost to handle new post creation
    req, // represents the HTTP request object containing image, caption, and authenticated user ID
    res // represents the HTTP response object used to send back success or error responses
) => {
    try { // start a try block to safely execute asynchronous operations
        const { caption } = req.body; // extract the caption text from the request body
        const image = req.file; // extract the uploaded image file from the request (handled by multer)
        const authorId = req.id; // extract the authenticated user's ID from the request (set by auth middleware)

        if (!image) return res.status(400).json({ message: 'Image required' }); // validate that an image was uploaded before proceeding

        const optimizedImageBuffer = await sharp(image.buffer) // use sharp to process and optimize the uploaded image
            .resize({ // resize the image to fit within 800x800 dimensions while maintaining aspect ratio
                width: 800, // set the target image width to 800 pixels
                height: 800, // set the target image height to 800 pixels
                fit: 'inside' // ensure the image fits inside the box without cropping
            })
            .toFormat('jpeg', { quality: 80 }) // convert the image format to JPEG with 80% compression quality
            .toBuffer(); // return the optimized image as a buffer for further processing

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`; // convert the image buffer to a base64 Data URI for Cloudinary upload
        
        const cloudResponse = await cloudinary.uploader.upload(fileUri); // upload the optimized image to Cloudinary and store the response (includes the secure URL)
        
        const post = await Post.create({ // create a new post document in MongoDB
            caption, // assign the post caption from user input
            image: cloudResponse.secure_url, // store the Cloudinary image URL in the post document
            author: authorId // associate the post with the current user's ID as the author
        });
        
        const user = await User.findById(authorId); // retrieve the user document who created the post
        
        if (user) { // check if the user exists in the database
            user.posts.push(post._id); // add the new post's ID to the user's posts array
            await user.save(); // save the updated user document back to the database
        }

        await post.populate({ // populate the author field in the newly created post
            path: 'author', // specify the field to populate
            select: '-password' // exclude the password field from the author data for security
        });

        return res.status(201).json({ // send a successful HTTP response indicating the post was created
            message: 'New post added', // confirmation message
            post, // include the newly created post object in the response
            success: true // indicate successful operation
        });
    } catch (error) { // catch and handle any errors that occur during the process
        console.log(error); // log the error details to the console for debugging purposes
    }
};

export const getAllPost = async ( // define an asynchronous function named getAllPost to retrieve all posts from the database
    req, // represents the HTTP request object (not used here but required for the route handler signature)
    res // represents the HTTP response object used to send the retrieved posts or errors
) => {
    try { // start a try block to handle any errors during database operations
        const posts = await Post.find() // fetch all posts from the MongoDB posts collection
            .sort({ createdAt: -1 }) // sort the posts in descending order by creation date (latest first)
            .populate({ // populate the author field in each post to include user details
                path: 'author', // specify that the author field should be populated
                select: 'username profilePicture' // select only the username and profile picture fields from the author
            })
            .populate({ // populate the comments field for each post
                path: 'comments', // specify the comments field to populate
                sort: { createdAt: -1 }, // sort comments in descending order by creation date
                populate: { // nested populate to fetch comment author details
                    path: 'author', // populate the author field inside each comment
                    select: 'username profilePicture' // select only username and profile picture for comment authors
                }
            });
        
        return res.status(200).json({ // send a successful HTTP response after fetching posts
            posts, // include the retrieved posts with populated author and comments data
            success: true // indicate successful operation
        });
    } catch (error) { // handle any runtime or database errors
        console.log(error); // log the error for debugging
    }
};

export const getUserPost = async ( // define an asynchronous function named getUserPost to retrieve posts created by the authenticated user
    req, // represents the HTTP request object containing the user's ID
    res // represents the HTTP response object used to send the user's posts or errors
) => {
    try { // start a try block to handle possible runtime or query errors
        const authorId = req.id; // extract the authenticated user's ID from the request (set during authentication)
        
        const posts = await Post.find({ author: authorId }) // find posts where the author field matches the logged-in user's ID
            .sort({ createdAt: -1 }) // sort posts by newest first
            .populate({ // populate the author field in each post
                path: 'author', // specify that the author field should be populated
                select: 'username, profilePicture' // select only username and profilePicture fields for privacy
            })
            .populate({ // populate the comments associated with each post
                path: 'comments', // specify the comments field to populate
                sort: { createdAt: -1 }, // sort comments in descending order by creation date
                populate: { // perform nested population for each comment’s author
                    path: 'author', // populate the author field inside each comment
                    select: 'username, profilePicture' // include only username and profile picture for comment authors
                }
            });
        
        return res.status(200).json({ // send a successful response after fetching user-specific posts
            posts, // include the posts created by the authenticated user
            success: true // indicate successful retrieval
        });
    } catch (error) { // catch any errors during the query or data retrieval
        console.log(error); // log the error to the console for debugging purposes
    }
};

export const likePost = async ( // define an asynchronous function named likePost to handle post liking
    req, // represents the HTTP request object containing post ID and user info
    res // represents the HTTP response object used to send a response to the client
) => {
    try { // start try block to handle errors gracefully
        const likeKrneWalaUserKiId = req.id; // extract the ID of the user who is liking the post from the authenticated request
        
        const postId = req.params.id; // extract the post ID from request parameters (URL)
        
        const post = await Post.findById(postId); // find the post document in MongoDB using its ID
        
        if (!post) return res.status(404).json({ message: 'Post not found', success: false }); // if no post found, send a 404 response
        
        await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } }); // add the user's ID to the likes array using $addToSet to prevent duplicates
        await post.save(); // save the post after updating the likes array
        
        const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture'); // fetch the user details (username and profile picture) who liked the post

        const postOwnerId = post.author.toString(); // convert the post author's ObjectId to a string for comparison
        
        if (postOwnerId !== likeKrneWalaUserKiId) { // check if the liker is not the owner of the post
            const notification = { // create a notification object to inform the post owner
                type: 'like', // set the notification type as 'like'
                userId: likeKrneWalaUserKiId, // include the ID of the user who liked
                userDetails: user, // include user details such as username and profile picture
                postId, // include the post ID that was liked
                message: 'Your post was liked' // message text for the notification
            };
            
            const postOwnerSocketId = getReceiverSocketId(postOwnerId); // get the socket ID of the post owner to send a real-time notification
            
            io.to(postOwnerSocketId).emit('notification', notification); // emit a 'notification' event via socket.io to the post owner's socket
        }

        return res.status(200).json({ message: 'Post liked', success: true }); // send success response confirming the post was liked
    } catch (error) { // catch and handle any errors
        console.log("Error occured while liking the post: ", error); // log the error message for debugging
    }
};

export const dislikePost = async ( // define an asynchronous function named dislikePost to handle post unliking
    req, // represents the HTTP request object containing post ID and user info
    res // represents the HTTP response object used to send a response to the client
) => {
    try { // start try block to handle runtime or DB errors
        const likeKrneWalaUserKiId = req.id; // extract the ID of the user who is disliking (removing like)
        
        const postId = req.params.id; // extract the post ID from the request parameters
        
        const post = await Post.findById(postId); // find the post document in the database using the post ID
        
        if (!post) return res.status(404).json({ message: 'Post not found', success: false }); // return 404 response if post not found

        await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } }); // remove the user's ID from the likes array using $pull operator
        await post.save(); // save the post document after removing the like

        const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture'); // fetch the user details of the disliking user
        
        const postOwnerId = post.author.toString(); // convert the post author's ObjectId to string for comparison
        
        if (postOwnerId !== likeKrneWalaUserKiId) { // ensure the disliker is not the post owner
            const notification = { // create a notification object to inform the post owner
                type: 'dislike', // set the notification type as 'dislike'
                userId: likeKrneWalaUserKiId, // include the disliking user's ID
                userDetails: user, // include the user's basic details
                postId, // include the post ID that was disliked
                message: 'Your post was liked' // message text (likely a typo, should say 'Your post was disliked')
            };

            const postOwnerSocketId = getReceiverSocketId(postOwnerId); // fetch the post owner's socket ID
            
            io.to(postOwnerSocketId).emit('notification', notification); // send the notification to the post owner's socket
        }

        return res.status(200).json({ message: 'Post disliked', success: true }); // send success response confirming the post was disliked
    } catch (error) { // handle any runtime or DB errors
        console.log("Error occured while disliking the post: ", error); // log the error for debugging
    }
};

export const addComment = async ( // define an asynchronous function named addComment to handle adding a new comment to a post
    req, // represents the HTTP request object containing comment details, user ID, and post ID
    res // represents the HTTP response object used to send responses to the client
) => {
    try { // start try block to handle possible runtime or database errors
        const postId = req.params.id; // extract the post ID from the request parameters (URL segment)

        const commentKrneWalaUserKiId = req.id; // extract the ID of the user who is writing the comment from the authenticated request

        const { text } = req.body; // destructure and extract the 'text' field (comment text) from the request body

        const post = await Post.findById(postId); // find the post document in MongoDB using the extracted post ID

        if (!text) return res.status(400).json({ message: 'text is required', success: false }); // if no text provided, send 400 bad request response

        const comment = await Comment.create({ // create a new comment document in MongoDB
            text, // store the comment text
            author: commentKrneWalaUserKiId, // link the comment to the user who wrote it using their ID
            post: postId // link the comment to the post it belongs to using the post ID
        });

        await comment.populate({ // populate the comment with author details for returning user info
            path: 'author', // specify that we want to populate the 'author' field
            select: "username profilePicture" // include only username and profile picture fields
        });

        post.comments.push(comment._id); // push the newly created comment’s ID into the post’s comments array
        await post.save(); // save the updated post document after adding the new comment reference

        return res.status(201).json({ // send a 201 created response confirming successful comment creation
            message: 'Comment Added', // include success message
            comment, // include the newly created comment in response
            success: true // mark operation as successful
        });
    } catch (error) { // catch block to handle errors
        console.log(error); // log the error for debugging
    }
};

export const getCommentsOfPost = async ( // define an asynchronous function named getCommentsOfPost to fetch all comments for a specific post
    req, // represents the HTTP request object containing post ID
    res // represents the HTTP response object used to send comments to the client
) => {
    try { // start try block for safe DB operations
        const postId = req.params.id; // extract the post ID from request parameters

        const comments = await Comment.find({ post: postId }) // query the Comment collection to find comments linked to the given post ID
            .populate('author', 'username profilePicture'); // populate the author field to include username and profile picture for each comment

        if (!comments) return res.status(404).json({ message: 'No comments found for this post', success: false }); // if no comments found, send a 404 response

        return res.status(200).json({ success: true, comments }); // send success response with retrieved comments
    } catch (error) { // handle errors if any occur
        console.log(error); // log the error for debugging purposes
    }
};

export const deletePost = async ( // define an asynchronous function named deletePost to handle deleting a post
    req, // represents the HTTP request object that carries post ID and authenticated user ID
    res // represents the HTTP response object used to send responses back to the client
) => {
    try { // start try block for safe async operation
        const postId = req.params.id; // extract the post ID from request parameters (URL)

        const authorId = req.id; // extract the authenticated user's ID (the author of the post)

        const post = await Post.findById(postId); // find the post in MongoDB by its ID

        if (!post) return res.status(404).json({ message: 'Post not found', success: false }); // if post not found, send 404 response

        if (post.author.toString() !== authorId) return res.status(403).json({ message: 'Unauthorized' }); // ensure only the post's author can delete it

        await Post.findByIdAndDelete(postId); // delete the post document from MongoDB using its ID

        let user = await User.findById(authorId); // find the user who created the post

        user.posts = user.posts.filter(id => id.toString() !== postId); // remove the deleted post ID from user's posts array

        await user.save(); // save the updated user document

        await Comment.deleteMany({ post: postId }); // delete all comments linked to the deleted post

        return res.status(200).json({ // send successful deletion response
            success: true,
            message: 'Post deleted'
        });
    } catch (error) { // handle errors if any occur
        console.log(error); // log error for debugging
    }
};

export const bookmarkPost = async ( // define an asynchronous function named bookmarkPost to handle saving or unsaving posts
    req, // represents the HTTP request object that carries post ID and authenticated user ID
    res // represents the HTTP response object used to send responses back to the client
) => {
    try { // start try block for safe async operation
        const postId = req.params.id; // extract the post ID from request parameters (URL)

        const authorId = req.id; // extract the authenticated user's ID

        const post = await Post.findById(postId); // find the post document in MongoDB using its ID

        if (!post) return res.status(404).json({ message: 'Post not found', success: false }); // if post does not exist, send 404 response

        const user = await User.findById(authorId); // find the user who is performing the bookmark action

        if (user.bookmarks.includes(post._id)) { // check if the post is already bookmarked by the user
            await user.updateOne({ $pull: { bookmarks: post._id } }); // remove the post ID from user's bookmarks array using $pull
            await user.save(); // save the updated user document
            return res.status(200).json({ type: 'unsaved', message: 'Post removed from bookmark', success: true }); // send response confirming unbookmark
        } else {
            await user.updateOne({ $addToSet: { bookmarks: post._id } }); // add the post ID to user's bookmarks array without duplication using $addToSet
            await user.save(); // save the updated user document
            return res.status(200).json({ type: 'saved', message: 'Post bookmarked', success: true }); // send response confirming successful bookmark
        }
    } catch (error) { // catch errors if any occur
        console.log(error); // log the error for debugging
    }
};
