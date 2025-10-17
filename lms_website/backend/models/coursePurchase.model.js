import mongoose from "mongoose"; // import the mongoose library to define and manage MongoDB schemas and models

const coursePurchaseSchema = new mongoose.Schema( // create a new schema named coursePurchaseSchema to represent data for course purchases
    {
        courseId: { // define the courseId field
            type: mongoose.Schema.Types.ObjectId, // set the type as ObjectId to reference another document in MongoDB
            ref: 'Course', // reference the Course model to link the purchase to a specific course
            required: true // mark this field as required since each purchase must be associated with a course
        },

        userId: { // define the userId field
            type: mongoose.Schema.Types.ObjectId, // set the type as ObjectId to reference another document in MongoDB
            ref: 'User', // reference the User model to link the purchase to a specific user
            required: true // mark this field as required since each purchase must belong to a user
        },

        amount: { // define the amount field
            type: Number, // set the data type as Number to store the amount paid for the course
            required: true // mark this field as required since each purchase must have an amount value
        },

        status: { // define the status field
            type: String, // set the data type as String to represent the payment status
            enum: ['pending', 'completed', 'failed'], // restrict the possible values to 'pending', 'completed', or 'failed'
            default: 'pending' // set the default value to 'pending' indicating an unprocessed purchase initially
        },

        paymentId: { // define the paymentId field
            type: String, // set the data type as String to store the transaction or payment identifier
            required: true // mark this field as required since each purchase must have a unique payment reference
        }
    },
    { timestamps: true } // enable automatic creation of createdAt and updatedAt timestamps for each document
);

export const CoursePurchase = mongoose.model( // create and export a Mongoose model named CoursePurchase
    'CoursePurchase', // set the model name to 'CoursePurchase' which will represent this schema in MongoDB
    coursePurchaseSchema // pass the defined schema to associate it with the model
);
