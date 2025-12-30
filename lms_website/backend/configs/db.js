import mongoose from "mongoose"; // import mongoose library to manage mongodb connections and schemas

const connectDb = async () => { // define a function to establish a connection with the mongodb database
    try {
        await mongoose.connect(process.env.MONGODB_URL); // connect to mongodb using connection string from environment variables
        console.log("DB connected"); // log confirmation message when database connection is successful
    } catch (error) {
        console.log("DB error"); // log generic error message when database connection fails
    }
};

export default connectDb