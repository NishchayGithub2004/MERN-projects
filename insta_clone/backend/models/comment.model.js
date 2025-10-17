import mongoose from "mongoose"; // import the mongoose library to interact with MongoDB using object modeling

const commentSchema = new mongoose.Schema({ // define a new Mongoose schema named commentSchema to represent the structure of a comment document
    text: { // define a field named text for storing the comment content
        type: String, // specify that the text field must be of type String
        required: true // make the text field mandatory to ensure every comment has content
    },
    
    author: { // define a field named author to reference the user who made the comment
        type: mongoose.Schema.Types.ObjectId, // specify the field type as ObjectId to reference another document in MongoDB
        ref: 'User', // set the reference model name to 'User' so Mongoose knows which collection to link
        required: true // make the author field mandatory to ensure every comment has an associated user
    },
    
    post: { // define a field named post to reference the post the comment belongs to
        type: mongoose.Schema.Types.ObjectId, // specify ObjectId type to create a reference to another document
        ref: 'Post', // set the reference model name to 'Post' to link each comment to its post
        required: true // make the post field mandatory so every comment is tied to a post
    },
}); 

export const Comment = mongoose.model( // define and export a Mongoose model named Comment based on the commentSchema
    'Comment', // specify the model name 'Comment' which will correspond to the 'comments' collection in MongoDB
    commentSchema // pass the schema definition that defines the structure of Comment documents
);
