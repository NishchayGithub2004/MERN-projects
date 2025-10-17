import mongoose from "mongoose" // import the mongoose library to define and manage MongoDB schemas and models

const courseSchema = new mongoose.Schema( // create a new mongoose schema named courseSchema to define the structure of the Course collection
    {
        courseTitle: { // define the courseTitle field
            type: String, // set the data type of courseTitle as String
            required: true // make the field mandatory for each course document
        },
        
        subTitle: { type: String }, // define an optional subTitle field with type String
        
        description: { type: String }, // define an optional description field with type String
        
        category: { // define the category field
            type: String, // set the data type as String
            required: true // make the category field required for each course document
        },
        
        courseLevel: { // define the courseLevel field
            type: String, // set the data type as String
            enum: ["Beginner", "Medium", "Advance"] // restrict the values of courseLevel to one of the three allowed strings
        },
        
        coursePrice: { // define the coursePrice field
            type: Number // set the data type of coursePrice as Number
        },
        
        courseThumbnail: { // define the courseThumbnail field
            type: String // set the data type as String to store the URL or path of the course thumbnail image
        },
        
        enrolledStudents: [ // define an array field enrolledStudents to store the list of students enrolled in the course
            {
                type: mongoose.Schema.Types.ObjectId, // set each element to be an ObjectId referencing another document
                ref: 'User' // reference the User model to establish a relationship with the users collection
            }
        ],
        
        lectures: [ // define an array field lectures to store associated lectures for the course
            {
                type: mongoose.Schema.Types.ObjectId, // set each element to be an ObjectId referencing another document
                ref: "Lecture" // reference the Lecture model to establish a relationship with the lectures collection
            }
        ],
        
        creator: { // define the creator field
            type: mongoose.Schema.Types.ObjectId, // set the data type as ObjectId to link to another document
            ref: 'User' // reference the User model to identify which user created the course
        },
        
        isPublished: { // define the isPublished field
            type: Boolean, // set the data type as Boolean
            default: false // set the default value to false meaning the course is unpublished by default
        }
    },
    { timestamps: true } // enable automatic creation of createdAt and updatedAt timestamps for each document
);

export const Course = mongoose.model( // create and export a Mongoose model named Course
    "Course", // set the model name to 'Course' which will be used as the collection name in MongoDB
    courseSchema // pass the previously defined schema to bind it to the model
);
