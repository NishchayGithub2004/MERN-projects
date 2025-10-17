import mongoose from "mongoose"; // import the mongoose library to interact with MongoDB using an object data modeling approach

const connectDB = async () => { // define an asynchronous function connectDB to establish a connection to the MongoDB database
    try { // start a try block to handle any errors that might occur during the connection attempt
        await mongoose.connect(process.env.MONGO_URI); // call mongoose.connect with the MongoDB connection string from the environment variable MONGO_URI and wait for the connection to be established
        console.log('mongodb connected successfully'); // log a success message to the console once the database connection is successful
    } catch (error) { // start a catch block to handle any errors thrown in the try block
        console.log(error); // log the caught error to the console for debugging purposes
    }
}

export default connectDB; // export the connectDB function as the default export for use in other modules
