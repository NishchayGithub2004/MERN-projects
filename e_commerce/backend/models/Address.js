import mongoose from "mongoose"; // import mongoose library to define schemas and interact with MongoDB

const AddressSchema = new mongoose.Schema( // create a new mongoose schema instance called AddressSchema to define the structure of address documents
    { // define the schema fields and their data types
        userId: String, // declare a 'userId' field of type String to store the ID of the user who owns the address
        address: String, // declare an 'address' field of type String to store the main address line
        city: String, // declare a 'city' field of type String to store the city name of the address
        pincode: String, // declare a 'pincode' field of type String to store the postal or ZIP code
        phone: String, // declare a 'phone' field of type String to store the contact phone number associated with the address
        notes: String, // declare a 'notes' field of type String to store any additional remarks or instructions related to the address
    },
    { timestamps: true } // enable automatic creation of 'createdAt' and 'updatedAt' fields by setting timestamps to true
);

module.exports = mongoose.model("Address", AddressSchema); // create and export a mongoose model named 'Address' using the AddressSchema to interact with the 'addresses' collection in MongoDB
