import mongoose from "mongoose"; // import the mongoose library to define schemas and models for MongoDB documents

const messageSchema = new mongoose.Schema({ // define a new Mongoose schema named messageSchema to represent the structure of a message document
    senderId: { // define a field named senderId to reference the user who sent the message
        type: mongoose.Schema.Types.ObjectId, // specify the data type as ObjectId to reference another document in MongoDB
        ref: 'User' // set the reference model name to 'User' so this field links to a user document
    },
    
    receiverId: { // define a field named receiverId to reference the user who receives the message
        type: mongoose.Schema.Types.ObjectId, // specify the data type as ObjectId to create a relation to another document
        ref: 'User' // set the reference model name to 'User' to link the receiver to a user document
    },
    
    message: { // define a field named message to store the content of the message
        type: String, // specify the data type as String since messages are textual
        required: true // make this field mandatory to ensure every message has text content
    }
});

export const Message = mongoose.model( // define and export a Mongoose model named Message based on the schema
    'Message', // specify the model name 'Message' which will correspond to the 'messages' collection in MongoDB
    messageSchema // pass the messageSchema to define the document structure for this model
);
