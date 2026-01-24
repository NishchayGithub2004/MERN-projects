import mongoose from "mongoose"; // import mongoose library to define schemas and interact with MongoDB collections

const FeatureSchema = new mongoose.Schema( // create a new schema instance named FeatureSchema to define the structure of feature documents
  { // define the fields for the Feature schema
    image: String, // declare an 'image' field of type String to store the URL or path of the feature image
  },
  { timestamps: true } // enable automatic creation of 'createdAt' and 'updatedAt' fields for tracking when documents are created or updated
);

module.exports = mongoose.model("Feature", FeatureSchema); // create and export a mongoose model named 'Feature' using the FeatureSchema to interact with the 'features' collection in MongoDB
