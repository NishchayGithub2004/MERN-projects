import mongoose from "mongoose"; // import the mongoose library to define and manage MongoDB schemas and models

const lectureSchema = new mongoose.Schema( // create a new schema named lectureSchema to represent lecture data in MongoDB
    {
        lectureTitle: { // define the lectureTitle field
            type: String, // set the data type as String to store the title of the lecture
            required: true, // mark this field as required to ensure each lecture has a title
        },
        
        videoUrl: { type: String }, // define an optional field videoUrl as a string to store the URL of the lecture video
        
        publicId: { type: String }, // define an optional field publicId as a string to store the Cloudinary or storage identifier of the video
        
        isPreviewFree: { type: Boolean }, // define an optional boolean field isPreviewFree to indicate whether the lecture is available for free preview
    },
    { timestamps: true } // enable automatic creation of createdAt and updatedAt timestamps for each lecture document
);

export const Lecture = mongoose.model( // create and export a Mongoose model named Lecture
    "Lecture", // set the model name to 'Lecture' which will be used as the collection name in MongoDB
    lectureSchema // pass the lectureSchema to define the structure of lecture documents
);
