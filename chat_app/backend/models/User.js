import mongoose from "mongoose"; // import mongoose to define schemas and create models for MongoDB collections

const userSchema = new mongoose.Schema( // define a mongoose schema to describe the structure and constraints of user documents
    {
        email: { // define the email field to uniquely identify each user account
            type: String, // store the email value as a string for validation and querying
            required: true, // enforce presence of email to prevent anonymous or incomplete users
            unique: true, // ensure no two users can register with the same email address
        },
        fullName: { // define the fullName field to store the user's display name
            type: String, // store the user's full name as a string for display and identification
            required: true, // require full name so the user profile is always identifiable
        },
        password: { // define the password field to store the user's hashed password
            type: String, // store the password hash as a string
            required: true, // enforce password presence to secure user accounts
            minlength: 6, // ensure a minimum password length to improve security
        },
        profilePic: { // define the profilePic field to store the user's profile image URL
            type: String, // store the profile picture reference as a string URL or path
            default: "", // default to an empty string when no profile picture is provided
        },
    },
    { timestamps: true } // automatically add createdAt and updatedAt fields to track user record lifecycle
);

export default User = mongoose.model("User", userSchema); // create and export the User model to interact with the users collection in MongoDB