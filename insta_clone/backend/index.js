import express, { urlencoded } from "express"; // import express to create and configure the application, and import urlencoded to parse URL-encoded request bodies
import cors from "cors"; // import CORS middleware to enable cross-origin resource sharing
import cookieParser from "cookie-parser"; // import cookie-parser to parse cookies from client requests
import dotenv from "dotenv"; // import dotenv to load environment variables from a .env file
import connectDB from "./utils/db.js"; // import custom function to establish a connection to the MongoDB database
import userRoute from "./routes/user.route.js"; // import route module to handle all user-related API endpoints
import postRoute from "./routes/post.route.js"; // import route module to handle all post-related API endpoints
import messageRoute from "./routes/message.route.js"; // import route module to handle all message-related API endpoints
import { app, server } from "./socket/socket.js"; // import express app and socket server instance to support both HTTP and WebSocket communication

dotenv.config({}); // call dotenv.config() to load environment variables from the .env file into process.env

const PORT = process.env.PORT || 3000; // define a constant PORT to store the server's running port, using environment variable or default 3000

app.use(express.json()); // use express.json() middleware to parse incoming JSON payloads from client requests

app.use(cookieParser()); // use cookieParser middleware to parse cookies in request headers for authentication or session tracking

app.use(
    urlencoded({ extended: true }) // use urlencoded middleware to parse URL-encoded request bodies; 'extended: true' allows nested object parsing
);

const corsOptions = { // define options object for CORS configuration
    origin: process.env.URL, // specify allowed origin for cross-origin requests from frontend URL
    credentials: true // allow credentials such as cookies or authorization headers in cross-origin requests
};

app.use(cors(corsOptions)); // use CORS middleware with specified options to handle cross-origin requests securely

app.use("/api/v1/user", userRoute); // mount the userRoute to handle all endpoints starting with '/api/v1/user'
app.use("/api/v1/post", postRoute); // mount the postRoute to handle all endpoints starting with '/api/v1/post'
app.use("/api/v1/message", messageRoute); // mount the messageRoute to handle all endpoints starting with '/api/v1/message'

server.listen(PORT, () => { // start the server to listen on the defined PORT
    connectDB(); // call the connectDB function to connect to MongoDB before handling requests
    console.log(`Server listen at port ${PORT}`); // log the active port to confirm successful startup
});
