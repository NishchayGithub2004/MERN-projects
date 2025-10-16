import mongoose from "mongoose"; // import the mongoose library to define schemas and models for MongoDB collections

const companySchema = new mongoose.Schema({ // define a new mongoose schema named companySchema to represent company data
    name: { // define a field named name to store the company's name
        type: String, // set the data type of the field as String
        required: true, // make this field mandatory, meaning it must be provided when creating a company record
        unique: true // ensure that each company name in the collection is unique and not duplicated
    },
    
    description: { // define a field named description to store information about the company
        type: String // set the data type as String, allowing optional descriptive text
    },
    
    website: { // define a field named website to store the company's website URL
        type: String // set the data type as String
    },
    
    location: { // define a field named location to store the company's geographical location
        type: String // set the data type as String
    },
    
    logo: { // define a field named logo to store the URL or path of the company's logo image
        type: String // set the data type as String
    },
    
    userId: { // define a field named userId to associate the company with a specific user (e.g., owner or creator)
        type: mongoose.Schema.Types.ObjectId, // set the field type as ObjectId to reference another document
        ref: 'User', // specify that this ObjectId refers to the 'User' collection
        required: true // make this field mandatory to ensure every company is linked to a user
    }
}, { timestamps: true }); // enable timestamps to automatically add 'createdAt' and 'updatedAt' fields for record tracking

export const Company = mongoose.model("Company", companySchema); // create and export a mongoose model named 'Company' based on companySchema for performing database operations on the 'companies' collection
