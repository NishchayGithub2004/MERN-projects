import mongoose from "mongoose"; // import the mongoose library to define schemas and models for MongoDB collections

const jobSchema = new mongoose.Schema({ // define a new mongoose schema named jobSchema to represent job posting data
    title: { // define a field named title to store the job title
        type: String, // set the data type as String
        required: true // make this field mandatory so every job must have a title
    },

    description: { // define a field named description to store detailed information about the job
        type: String, // set the data type as String
        required: true // make this field mandatory since each job should include a description
    },

    requirements: [{ // define a field named requirements as an array to store multiple job requirements
        type: String // set each element in the array to be a String describing an individual requirement
    }],

    salary: { // define a field named salary to store the offered salary for the job
        type: Number, // set the data type as Number
        required: true // make this field mandatory to ensure salary details are always provided
    },

    experienceLevel: { // define a field named experienceLevel to specify required experience in years or level
        type: Number, // set the data type as Number
        required: true // make this field mandatory to ensure the experience criteria are clear
    },

    location: { // define a field named location to store the job's geographic location
        type: String, // set the data type as String
        required: true // make this field mandatory to indicate where the job is located
    },

    jobType: { // define a field named jobType to describe the nature of employment (e.g., full-time, part-time)
        type: String, // set the data type as String
        required: true // make this field mandatory so the type of job is always defined
    },

    position: { // define a field named position to specify the number of open positions or ranking
        type: Number, // set the data type as Number
        required: true // make this field mandatory to track available job openings
    },

    company: { // define a field named company to reference the company that posted the job
        type: mongoose.Schema.Types.ObjectId, // set the field type as ObjectId to link to a company document
        ref: 'Company', // specify that this ObjectId references the 'Company' collection
        required: true // make this field mandatory to ensure every job is linked to a company
    },

    created_by: { // define a field named created_by to reference the user who created or posted the job
        type: mongoose.Schema.Types.ObjectId, // set the field type as ObjectId to link to a user document
        ref: 'User', // specify that this ObjectId references the 'User' collection
        required: true // make this field mandatory to record who created the job post
    },

    applications: [ // define a field named applications to store references to all job applications for this job
        { 
            type: mongoose.Schema.Types.ObjectId, // set each element type as ObjectId to reference an application document
            ref: 'Application' // specify that these ObjectIds reference the 'Application' collection
        }
    ]
}, { timestamps: true }); // enable timestamps to automatically create 'createdAt' and 'updatedAt' fields for tracking changes

export const Job = mongoose.model("Job", jobSchema); // create and export a mongoose model named 'Job' based on jobSchema for performing CRUD operations on the 'jobs' collection
