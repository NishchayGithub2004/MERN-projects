import mongoose from "mongoose"; // import mongoose to manage MongoDB connections and interact with the database
import { ENV } from "./env.js"; // import environment configuration to access database connection variables

export const connectDB = async () => { // define an asynchronous function named connectDB to establish a MongoDB connection
    try { // wrap the connection logic in a try block to catch and handle connection errors
        const { MONGO_URI } = ENV; // extract the MongoDB connection string from environment variables for validation and use
        
        if (!MONGO_URI) throw new Error("MONGO_URI is not set"); // validate that the MongoDB URI exists to prevent runtime connection failures

        const conn = await mongoose.connect(ENV.MONGO_URI); // initiate a connection to MongoDB using mongoose and wait for it to complete
        
        console.log("MONGODB CONNECTED : ", conn.connection.host); // log the connected MongoDB host to confirm a successful connection
    } catch (error) { // catch any errors that occur during the connection attempt
        console.error("Error connection to MONGODB : ", error); // log the connection error details for debugging and visibility
        process.exit(1); // terminate the process with a failure code to avoid running the app without a database
    }
};