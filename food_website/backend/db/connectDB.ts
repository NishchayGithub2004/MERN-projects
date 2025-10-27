import mongoose from "mongoose"; // import mongoose library to connect and interact with mongoDB database

const connectDB = async () => { // create an async function to connect to mongoDB database
    try { // try block to handle any potential errors during connection
        await mongoose.connect(process.env.MONGO_URI!); // connect to mongoDB database, provide the URI of database to connect to using MONGO_URI environment variable
        console.log('mongoDB connected'); // log a message to console if connection is successful
    } catch (error) {
        console.log(error); // if any error occurs during connection, log it to the console for debugging purposes
    }
}

export default connectDB; // export the connectDB function to be used in other parts of the application