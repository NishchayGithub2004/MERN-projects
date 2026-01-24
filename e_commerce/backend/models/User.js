import mongoose from "mongoose"; // import mongoose library using CommonJS syntax to define schemas and models for MongoDB

const UserSchema = new mongoose.Schema({ // create a new mongoose schema named UserSchema to define the structure of user documents
    userName: { // declare a 'userName' field to store the username of the user
        type: String, // set the data type to String to store text values for usernames
        required: true, // make this field mandatory to ensure every user has a username
        unique: true, // enforce uniqueness to prevent multiple users from having the same username
    },
    email: { // declare an 'email' field to store the user's email address
        type: String, // set the data type to String for storing email text
        required: true, // make this field mandatory to ensure every user provides an email
        unique: true, // enforce uniqueness to avoid duplicate email registrations
    },
    password: { // declare a 'password' field to store the user's hashed password
        type: String, // set the data type to String since hashed passwords are stored as strings
        required: true, // make this field mandatory to ensure every user has a password
    },
    role: { // declare a 'role' field to define the user's access level (e.g., admin or regular user)
        type: String, // set the data type to String since roles are text-based identifiers
        default: "user", // assign a default value of "user" so new users are regular users by default
    },
});

module.exports = mongoose.model("User", UserSchema); // create and export a mongoose model named 'User' using the UserSchema to interact with the 'users' collection in MongoDB
