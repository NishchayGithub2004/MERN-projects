import mongoose from "mongoose"; // import the mongoose library to interact with MongoDB databases

const connectDB = async () => { // define an asynchronous function connectDB to establish a connection to MongoDB
    try { // start a try block to handle possible connection errors
        await mongoose.connect( // call the connect() method from mongoose using await to establish a connection
            process.env.MONGO_URI // pass the MongoDB connection URI from environment variables to specify the database location
        );
        console.log('MongoDB Connected'); // log a success message to the console once the connection is successfully established
    } catch (error) { // catch block to handle connection errors
        console.log("error occured", error); // log a message and the error details to the console for debugging
    }
}

export default connectDB; // export the connectDB function as the default export for use in other modules
