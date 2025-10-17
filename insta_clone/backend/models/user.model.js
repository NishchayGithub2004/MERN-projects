import mongoose from "mongoose"; // import the mongoose library to define schemas and interact with MongoDB collections

const userSchema = new mongoose.Schema( // define a new Mongoose schema named userSchema to represent the structure of a user document
    {
        username: { // define a field named username to store the unique username of the user
            type: String, // specify that the username field must be of type String
            required: true, // make this field mandatory to ensure every user has a username
            unique: true // enforce uniqueness so no two users can have the same username
        },
        
        email: { // define a field named email to store the user's email address
            type: String, // specify that the email field must be a String
            required: true, // make this field mandatory so each user must have an email
            unique: true // enforce uniqueness to prevent duplicate email registrations
        },
        
        password: { // define a field named password to store the user's encrypted password
            type: String, // specify that the password field must be a String
            required: true // make this field mandatory to ensure secure authentication
        },
        
        profilePicture: { // define a field named profilePicture to store the user's profile image URL or path
            type: String, // specify the field type as String to hold the image URL/path
            default: '' // set an empty string as default if the user has no profile picture
        },
        
        bio: { // define a field named bio to store the user's short biography or description
            type: String, // specify the field type as String
            default: '' // set a default empty string for users without a bio
        },
        
        gender: { // define a field named gender to store the user's gender information
            type: String, // specify the field type as String
            enum: ['male', 'female'] // restrict allowed values to only 'male' or 'female' using an enumeration
        },
        
        followers: [{ // define a field named followers as an array to store users who follow this user
            type: mongoose.Schema.Types.ObjectId, // specify that each follower entry is a MongoDB ObjectId
            ref: 'User' // set the reference model name to 'User' so each follower links to a user document
        }],
        
        following: [{ // define a field named following as an array to store users this user follows
            type: mongoose.Schema.Types.ObjectId, // specify each following entry as an ObjectId reference
            ref: 'User' // set the reference model name to 'User' so each ObjectId links to another user
        }],
        
        posts: [{ // define a field named posts as an array to store post references created by the user
            type: mongoose.Schema.Types.ObjectId, // specify ObjectId type for each post reference
            ref: 'Post' // set the reference model name to 'Post' to link to the user's posts
        }],
        
        bookmarks: [{ // define a field named bookmarks as an array to store posts the user has bookmarked
            type: mongoose.Schema.Types.ObjectId, // specify ObjectId type for each bookmarked post
            ref: 'Post' // set the reference model name to 'Post' so it links to post documents
        }]
    },
    { timestamps: true } // enable automatic creation of createdAt and updatedAt fields for each document
);

export const User = mongoose.model( // define and export a Mongoose model named User using the defined schema
    'User', // specify the model name 'User' which corresponds to the 'users' collection in MongoDB
    userSchema // pass the userSchema to define the document structure for this model
);
