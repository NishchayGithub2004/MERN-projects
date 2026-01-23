import mongoose from "mongoose"; // import 'mongoose' object from 'mongoose' library to define schema for MongoDB documents

const messageSchema = new mongoose.Schema( // define schema for messages using 'Schema' constructor with the following properties
    {
        // unique ID of sender which is unique ID of document, it refers to 'User' model to know who is the sender of the message, and is required to have a value
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // unique ID of receiver which is unique ID of document, it refers to 'User' model to know who is the receiver of the message, and is required to have a value
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // text of message which is a string, it is trimmed to remove any leading or trailing spaces, and has a maximum length of 2000 characters
        text: {
            type: String,
            trim: true,
            maxlength: 2000,
        },
        // image of message which is a string
        image: {
            type: String,
        },
    },
    { timestamps: true } // include timestamps for when the message was created or last updated
);

const Message = mongoose.model("Message", messageSchema); // create a model named 'Message' using the defined schema and pass 'messageSchema' to it

export default Message; // export the 'Message' model to be used in other parts of the application