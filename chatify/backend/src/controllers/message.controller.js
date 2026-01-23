import cloudinary from "../lib/cloudinary.js"; // import 'cloudinary' object from 'cloudinary.js' file in 'lib' folder to upload images to cloudinary's cloud server
import { getReceiverSocketId, io } from "../lib/socket.js"; // from 'socket.js' file in 'lib' folder, import 'io' object to make communication b/w users possible
// and 'getReceiverSocketId' function to get the socket ID of the receiver of a message to send message to the appropriate receiver and not someone else
import Message from "../models/Message.js";
import User from "../models/User.js";

export const getAllContacts = async (req, res) => { // create a function named 'getAllContacts' to get all contacts of a user
    // it takes user's request to the backend and response of the backend to that request, both as objects
    try {
        const loggedInUserId = req.user._id; // get the unique ID of the user making the request from the request object
        
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        // from 'User' collection in the database, find all the users who are not the user itself and extract all their data except password

        res.status(200).json(filteredUsers); // return a 200 status code and a JSON object containing all the contacts of the user
    } catch (error) { // if any error occurs while getting all the contacts of the user
        console.log("Error occured while getting all contacts: ", error); // log the error to the console to know what error occured
        res.status(500).json({ message: "Internal server error" }); // return a 500 status code and a JSON object containing a message that an internal server error occured
    }
};

export const getMessagesByUserId = async (req, res) => { // create a function named 'getMessagesByUserId' to get all messages of a user
    // it takes user's request to the backend and response of the backend to that request, both as objects
    try {
        const myId = req.user._id; // get the unique ID of the user making the request from the request object
        
        const { id: userToChatId } = req.params; // get the unique ID of the user to whom message is to be sent from the request object

        // from 'Message' collection in the database, find all the messages of the user making the request and the user to whom message is to be sent using sender and receiver's unique IDs
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        res.status(200).json(messages); // return a 200 status code and a JSON object containing all the messages of the sender and receiver
    } catch (error) { // if any error occurs while getting all the messages of the sender and receiver
        console.log("Error occured while getting messages: ", error.message); // log the error to the console to know what error occured
        res.status(500).json({ error: "Internal server error" }); // return a 500 status code and a JSON object containing a message that an internal server error occured
    }
};

export const sendMessage = async (req, res) => { // create a function named 'sendMessage' to send message
    // it takes user's request to the backend and response of the backend to that request, both as objects
    try {
        const { text, image } = req.body; // extract message text and/or image from the request body
        
        const { id: receiverId } = req.params; // get the unique ID of receiver from the request object
        
        const senderId = req.user._id; // get the unique ID of sender from the request object

        if (!text && !image) return res.status(400).json({ message: "Text or image is required." });
        // if neither message text nor image is provided, return a 400 status code and a JSON object containing a message that message text or image is required
        
        if (senderId.equals(receiverId)) return res.status(400).json({ message: "Cannot send messages to yourself." });
        // if sender and receiver's unique IDs are same, return a 400 status code and a JSON object containing a message that you cannot send messages to yourself
        
        const receiverExists = await User.exists({ _id: receiverId }); // check if receiver exists in 'User' collection of the database by it's unique ID
        
        if (!receiverExists) return res.status(404).json({ message: "Receiver not found." });
        // if receiver does not exist, return a 404 status code and a JSON object containing a message that receiver not found

        let imageUrl; // declare a variable to store image URL
        
        if (image) { // if image is provided to send as a message
            const uploadResponse = await cloudinary.uploader.upload(image); // upload image to cloudinary's cloud server
            imageUrl = uploadResponse.secure_url; // store image's URL stored in cloudinary's cloud server in 'imageUrl' variable
        }

        // create a new document in 'Message' collection of the database to store message's data, including sender's unique ID, receiver's unique ID, message text and/or image URL
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save(); // save the new message document in the database

        const receiverSocketId = getReceiverSocketId(receiverId); // get the socket ID of the receiver of the message using 'getReceiverSocketId' function
        
        if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", newMessage); // if receiver exists in the app, send the new message to the receiver's socket ID

        res.status(201).json(newMessage); // return a 201 status code and a JSON object containing the new message document
    } catch (error) { // if any error occurs while sending message
        console.log("Error occured while sending message: ", error.message); // log the error to the console to know what error occured
        res.status(500).json({ error: "Internal server error" }); // return a 500 status code and a JSON object containing a message that an internal server error occured
    }
};

export const getChatPartners = async (req, res) => { // create a function named 'getChatPartners' to get all chat partners of a user
    // it takes user's request to the backend and response of the backend to that request, both as objects
    try {
        const loggedInUserId = req.user._id; // get the unique ID of the user making the request from the request object

        // find all the messages of the user making the request (who is sending the message) or the user to whom message is to be sent using sender and receiver's unique IDs
        const messages = await Message.find({
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        });

        // create a set of all messages of receiver if user making the request is sender, else create a set of all messages of sender if user making the request is receiver and convert it to array
        const chatPartnerIds = [
            ...new Set(
                messages.map((msg) =>
                    msg.senderId.toString() === loggedInUserId.toString()
                        ? msg.receiverId.toString()
                        : msg.senderId.toString()
                )
            ),
        ];

        const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");
        // from 'User' collection in the database, find all the users who are chat partners of the user making the request and extract all their data except password

        res.status(200).json(chatPartners); // return a 200 status code and a JSON object containing all the chat partners of the user
    } catch (error) { // if any error occurs while getting all the chat partners of the user
        console.error("Error occured while getting chat partners: ", error.message); // log the error to the console to know what error occured
        res.status(500).json({ error: "Internal server error" }); // return a 500 status code and a JSON object containing a message that an internal server error occured
    }
};