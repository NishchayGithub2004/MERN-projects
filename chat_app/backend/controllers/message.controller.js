import cloudinary from "../lib/cloudinary.js"; // import cloudinary client to manage message-related media uploads if required
import { getReceiverSocketId, io } from "../lib/socket.js"; // import getReceiverSocketId to resolve active socket ids for users, io to emit real-time socket events
import Message from "../models/Message.js"; // import Message model to query and persist chat messages in the database
import User from "../models/User.js"; // import User model to retrieve contact and user profile information

export const getAllContacts = async (req, res) => { // define a controller to fetch all users except the currently logged-in user
    try { // wrap database query logic in a try block to handle runtime errors
        const loggedInUserId = req.user._id; // extract the authenticated user's id from the request context
        
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password"); // query all users excluding the logged-in user and omit sensitive password field

        res.status(200).json(filteredUsers); // return the filtered user list as the contacts response
    } catch (error) { // catch errors that occur during user lookup
        console.log("Error in getAllContacts:", error); // log the error for debugging and monitoring
        res.status(500).json({ message: "Server error" }); // return a generic server error response
    }
};

export const getMessagesByUserId = async (req, res) => { // define a controller to retrieve all messages exchanged with a specific user
    try { // wrap message retrieval logic in a try block to handle query failures
        const myId = req.user._id; // read the authenticated user's id to scope message ownership
        
        const { id: userToChatId } = req.params; // extract the target user's id from route parameters

        const messages = await Message.find({ // query messages where either user is sender or receiver
            $or: [
                { senderId: myId, receiverId: userToChatId }, // match messages sent by the logged-in user to the target user
                { senderId: userToChatId, receiverId: myId }, // match messages sent by the target user to the logged-in user
            ],
        });

        res.status(200).json(messages); // return the full conversation message list to the client
    } catch (error) { // catch unexpected errors during message retrieval
        console.log("Error in getMessages controller: ", error.message); // log the error message for diagnostics
        res.status(500).json({ error: "Internal server error" }); // respond with a generic internal error status
    }
};

export const sendMessage = async (req, res) => { // define a controller to handle sending a new chat message from an authenticated user
    try { // wrap message creation and delivery logic in a try block to handle runtime errors
        const { text, image } = req.body; // extract message text and optional image payload from the request body
        
        const { id: receiverId } = req.params; // extract the receiver user id from route parameters
        
        const senderId = req.user._id; // read the authenticated sender's user id from the request context

        if (!text && !image) return res.status(400).json({ message: "Text or image is required." }); // validate that at least one message content type is provided
        
        if (senderId.equals(receiverId)) return res.status(400).json({ message: "Cannot send messages to yourself." }); // prevent users from sending messages to themselves
        
        const receiverExists = await User.exists({ _id: receiverId }); // check whether the receiver user exists in the database
        
        if (!receiverExists) return res.status(404).json({ message: "Receiver not found." }); // reject message creation if the receiver does not exist
        
        let imageUrl; // declare a variable to store the uploaded image url if an image is provided
        
        if (image) { // check whether the message includes an image payload
            const uploadResponse = await cloudinary.uploader.upload(image); // upload the image to cloudinary for persistent storage
            
            imageUrl = uploadResponse.secure_url; // store the secure cloudinary url for saving with the message
        }

        const newMessage = new Message({ // create a new Message document representing the chat message
            senderId, // associate the message with the sending user
            receiverId, // associate the message with the receiving user
            text, // attach the optional text content of the message
            image: imageUrl, // attach the uploaded image url if an image was included
        });

        await newMessage.save(); // persist the new message document to the database

        const receiverSocketId = getReceiverSocketId(receiverId); // resolve the active socket id of the receiver if they are online
        
        if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", newMessage); // emit the new message in real time to the receiver if connected

        res.status(201).json(newMessage); // return the newly created message as the response payload
    } catch (error) { // catch unexpected errors during message creation or delivery
        console.log("Error in sendMessage controller: ", error.message); // log the error message for debugging and monitoring
        res.status(500).json({ error: "Internal server error" }); // return a generic internal server error response
    }
};

export const getChatPartners = async (req, res) => { // define a controller to retrieve all unique users the authenticated user has chatted with
    try { // wrap chat partner resolution logic in a try block to handle query and processing errors
        const loggedInUserId = req.user._id; // extract the authenticated user's id from the request context

        const messages = await Message.find({ // query all messages where the user is either the sender or the receiver
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }], // match conversations involving the logged-in user
        });

        const chatPartnerIds = [ // define an array to store unique user ids of all chat partners for the logged-in user
            ...new Set( // spread a Set into an array to automatically remove duplicate user ids
                messages.map((msg) => // iterate over each message to extract the opposite participant's user id
                    msg.senderId.toString() === loggedInUserId.toString() // check whether the logged-in user is the sender of the message
                        ? msg.receiverId.toString() // pick the receiver's user id when the logged-in user sent the message
                        : msg.senderId.toString() // pick the sender's user id when the logged-in user received the message
                )
            ),
        ];

        const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password"); // fetch chat partner user records while excluding sensitive password data

        res.status(200).json(chatPartners); // return the resolved list of chat partner profiles to the client
    } catch (error) { // catch unexpected errors during message lookup or partner resolution
        console.error("Error in getChatPartners: ", error.message); // log the error message for debugging and observability
        res.status(500).json({ error: "Internal server error" }); // respond with a generic internal server error status
    }
};