import mongoose from "mongoose" // import the mongoose library to define and manage MongoDB schemas and models

const lectureProgressSchema = new mongoose.Schema({ // create a new schema named lectureProgressSchema to represent progress for individual lectures
    lectureId: { type: String }, // define lectureId as a string field to store the ID of a specific lecture
    viewed: { type: Boolean } // define viewed as a boolean field to track whether the lecture has been viewed by the user
});

const courseProgressSchema = new mongoose.Schema({ // create a new schema named courseProgressSchema to represent progress for an entire course
    userId: { type: String }, // define userId as a string field to identify which user the progress belongs to
    courseId: { type: String }, // define courseId as a string field to identify which course the progress is associated with
    completed: { type: Boolean }, // define completed as a boolean field to indicate whether the user has completed the course
    lectureProgress: [lectureProgressSchema] // define lectureProgress as an array of lectureProgressSchema to track progress for each lecture in the course
});

export const CourseProgress = mongoose.model( // create and export a Mongoose model named CourseProgress
    "CourseProgress", // set the model name to 'CourseProgress' which will be used as the collection name in MongoDB
    courseProgressSchema // pass the courseProgressSchema to define the structure of documents in this collection
);
