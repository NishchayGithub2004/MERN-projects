import mongoose from "mongoose"; // import the mongoose library to define and manage MongoDB schemas and models

const userSchema = new mongoose.Schema( // create a new schema named userSchema to represent user data in MongoDB
    {
        name: { // define the name field
            type: String, // set the data type as String to store the user's name
            required: true // mark this field as required so every user must have a name
        },
        
        email: { // define the email field
            type: String, // set the data type as String to store the user's email address
            required: true // mark this field as required so every user must have an email
        },
        
        password: { // define the password field
            type: String, // set the data type as String to store the user's hashed password
            required: true // mark this field as required so every user must have a password
        },
        
        role: { // define the role field
            type: String, // set the data type as String to store the user's role
            enum: ["instructor", "student"], // restrict possible values to either 'instructor' or 'student'
            default: 'student' // set the default role to 'student' if none is provided
        },
        
        enrolledCourses: [ // define an array field enrolledCourses to store courses the user is enrolled in
            {
                type: mongoose.Schema.Types.ObjectId, // set each element as an ObjectId referencing another document
                ref: 'Course' // reference the Course model to link the user to courses they are enrolled in
            }
        ],
        
        photoUrl: { // define the photoUrl field
            type: String, // set the data type as String to store the URL of the user's profile photo
            default: "" // set the default value as an empty string if no photo is provided
        }
    },
    { timestamps: true } // enable automatic creation of createdAt and updatedAt timestamps for each user document
);

export const User = mongoose.model( // create and export a Mongoose model named User
    "User", // set the model name to 'User' which will be used as the collection name in MongoDB
    userSchema // pass the userSchema to define the structure of user documents
);
