import mongoose from "mongoose"; // import the mongoose library to interact with MongoDB using object modeling

const userSchema = new mongoose.Schema( // define a constant 'userSchema' using mongoose.Schema to structure the user collection
    {
        fullname: { // define the 'fullname' field to store the user's full name
            type: String, // set the data type of 'fullname' as String
            required: true // make 'fullname' mandatory by setting required to true
        },
        
        email: { // define the 'email' field to store user's email
            type: String, // set the data type of 'email' as String
            required: true, // make 'email' mandatory by setting required to true
            unique: true // ensure all email values are unique by setting unique to true
        },
        
        phoneNumber: { // define the 'phoneNumber' field to store user's phone number
            type: Number, // set the data type of 'phoneNumber' as Number
            required: true // make 'phoneNumber' mandatory by setting required to true
        },
        
        password: { // define the 'password' field to store user's password
            type: String, // set the data type of 'password' as String
            required: true, // make 'password' mandatory by setting required to true
        },
        
        role: { // define the 'role' field to indicate user type
            type: String, // set the data type of 'role' as String
            enum: ['student', 'recruiter'], // restrict 'role' to either 'student' or 'recruiter' using enum
            required: true // make 'role' mandatory by setting required to true
        },
        
        profile: { // define the 'profile' field as a nested object to hold additional user details
            bio: { type: String }, // define 'bio' field to store user's bio with data type String
            skills: [{ type: String }], // define 'skills' as an array of strings to list user's skills
            resume: { type: String }, // define 'resume' to store the URL of user's uploaded resume file
            resumeOriginalName: { type: String }, // define 'resumeOriginalName' to store original filename of the resume
            company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, // define 'company' to store an ObjectId referencing 'Company' collection
            profilePhoto: { // define 'profilePhoto' field to store the URL or path of user's profile photo
                type: String, // set the data type of 'profilePhoto' as String
                default: "" // set an empty string as the default value if no photo is provided
            }
        },
    },
    { timestamps: true } // enable automatic creation of 'createdAt' and 'updatedAt' timestamps for each document
);

export const User = mongoose.model('User', userSchema); // create and export a Mongoose model named 'User' using the defined schema to interact with the 'users' collection in MongoDB
