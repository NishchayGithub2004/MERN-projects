import mongoose from "mongoose"; // import the mongoose library to define schema structures and models for MongoDB

const postSchema = new mongoose.Schema({ // define a new Mongoose schema named postSchema to represent the structure of a post document
    caption: { // define a field named caption to store the post's text caption
        type: String, // specify that the caption field must be of type String
        default: '' // set a default empty string so posts without captions won't throw validation errors
    },
    
    image: { // define a field named image to store the image URL or path for the post
        type: String, // specify that the image field must be a String since it will store a file path or URL
        required: true // make this field mandatory to ensure every post has an image
    },
    
    author: { // define a field named author to reference the user who created the post
        type: mongoose.Schema.Types.ObjectId, // specify that author will store a MongoDB ObjectId reference
        ref: 'User', // set the reference model name to 'User' so it links to the corresponding user document
        required: true // make this field mandatory to ensure each post has an associated author
    },
    
    likes: [{ // define a field named likes as an array to store users who liked the post
        type: mongoose.Schema.Types.ObjectId, // specify that each element in the array is an ObjectId reference
        ref: 'User' // set the reference model name to 'User' to link each ObjectId to a user document
    }],
    
    comments: [{ // define a field named comments as an array to store comment references associated with the post
        type: mongoose.Schema.Types.ObjectId, // specify that each comment is stored as an ObjectId reference
        ref: 'Comment' // set the reference model name to 'Comment' so each ObjectId links to a comment document
    }],
});

export const Post = mongoose.model( // define and export a Mongoose model named Post using the schema
    'Post', // specify the model name 'Post' which corresponds to the 'posts' collection in MongoDB
    postSchema // pass the postSchema to define the document structure for this model
);
