import mongoose from "mongoose"; // import the mongoose library to define and manage MongoDB data models

const conversationSchema = new mongoose.Schema({ // define a new Mongoose schema named conversationSchema to represent the structure of a conversation document
    participants: [{ // define a field named participants as an array to store the users involved in the conversation
        type: mongoose.Schema.Types.ObjectId, // specify each participant as an ObjectId to reference another document in MongoDB
        ref: 'User' // set the reference model name to 'User' so each ObjectId corresponds to a user document
    }],

    messages: [{ // define a field named messages as an array to store message references related to the conversation
        type: mongoose.Schema.Types.ObjectId, // specify each message as an ObjectId to reference another document
        ref: 'Message' // set the reference model name to 'Message' so each ObjectId links to a message document
    }]
});

export const Conversation = mongoose.model( // define and export a Mongoose model named Conversation using the defined schema
    'Conversation', // specify the model name 'Conversation' which will map to the 'conversations' collection in MongoDB
    conversationSchema // pass the conversationSchema to define the document structure for this model
);
