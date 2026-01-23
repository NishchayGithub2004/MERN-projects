import mongoose from "mongoose"; // import 'mongoose' object from 'mongoose' library to define schema for MongoDB documents

const userSchema = new mongoose.Schema( // define schema for user using 'Schema' constructor with the following properties
    {
        // email of user which is a string, it is required to have a value, and has a unique value
        email: {
            type: String,
            required: true,
            unique: true,
        },
        // full name of user which is a string, it is required to have a value
        fullName: {
            type: String,
            required: true,
        },
        // password of user which is a string, it is required to have a value, and has a minimum length of 6 characters
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        // profile picture of user which is a string, it has a default value of an empty string ie if no profile picture is uploaded, it will be an empty string
        profilePic: {
            type: String,
            default: "",
        },
    },
    { timestamps: true } // include timestamps for when the message was created or last updated
);

const User = mongoose.model("User", userSchema); // create a model named 'User' using the defined schema and pass 'userSchema' to it

export default User; // export the 'User' model to be used in other parts of the application