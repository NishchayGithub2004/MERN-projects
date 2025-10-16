import mongoose from "mongoose"; // import the mongoose library to define schemas and models for MongoDB collections

const applicationSchema = new mongoose.Schema({ // define a new mongoose schema named applicationSchema to represent job application data
    job: { // define a field named job to store the reference to a specific job
        type: mongoose.Schema.Types.ObjectId, // set the field type as ObjectId to reference another document in a different collection
        ref: 'Job', // specify the referenced collection as 'Job' for population purposes
        required: true // mark the field as required, meaning it must have a value
    },

    applicant: { // define a field named applicant to store the reference to the user who applied
        type: mongoose.Schema.Types.ObjectId, // set the field type as ObjectId to reference another document in the 'User' collection
        ref: 'User', // specify that this ObjectId references the 'User' collection
        required: true // mark this field as required
    },

    status: { // define a field named status to represent the current state of the application
        type: String, // set the field type as String
        enum: ['pending', 'accepted', 'rejected'], // restrict allowed values to the specified list for validation
        default: 'pending' // set the default value of the field to 'pending' when not provided
    }
}, { timestamps: true }); // enable automatic creation of 'createdAt' and 'updatedAt' fields to track record changes

export const Application = mongoose.model("Application", applicationSchema); // create and export a mongoose model named 'Application' based on the applicationSchema for performing database operations on the 'applications' collection
