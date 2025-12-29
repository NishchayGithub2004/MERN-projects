import mongoose from "mongoose"; // import mongoose to define schemas and create models for MongoDB collections

const messageSchema = new mongoose.Schema( // define a mongoose schema to represent individual chat messages
    {
        senderId: { // define the senderId field to reference the user who sent the message
            type: mongoose.Schema.Types.ObjectId, // store the sender reference as a MongoDB ObjectId
            ref: "User", // link this field to the User model for population and relational queries
            required: true, // enforce presence of senderId to ensure message ownership is always known
        },
        receiverId: { // define the receiverId field to reference the user who receives the message
            type: mongoose.Schema.Types.ObjectId, // store the receiver reference as a MongoDB ObjectId
            ref: "User", // link this field to the User model for population and relational queries
            required: true, // enforce presence of receiverId to ensure message destination is always known
        },
        text: { // define the text field to store the textual content of the message
            type: String, // store message text as a string
            trim: true, // automatically remove leading and trailing whitespace from the message text
            maxlength: 2000, // restrict message length to prevent excessively large text payloads
        },
        image: { // define the image field to store an optional image URL or reference
            type: String, // store the image location or identifier as a string
        },
    },
    { timestamps: true } // automatically add createdAt and updatedAt fields to track message timing
);

export default Message = mongoose.model("Message", messageSchema); // create and export the Message model to interact with the messages collection