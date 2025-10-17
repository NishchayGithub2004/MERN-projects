import express from "express"; // import express module to create and manage the web server
import dotenv from "dotenv"; // import dotenv module to load environment variables from a .env file
import cookieParser from "cookie-parser"; // import cookie-parser to parse cookies from incoming HTTP requests
import cors from "cors"; // import cors to enable cross-origin resource sharing for different origins
import connectDB from "./database/db.js"; // import custom database connection function from db.js
import userRoute from "./routes/user.route.js"; // import user-related routes from user.route.js
import courseRoute from "./routes/course.route.js"; // import course-related routes from course.route.js
import mediaRoute from "./routes/media.route.js"; // import media-related routes from media.route.js
import purchaseRoute from "./routes/purchaseCourse.route.js"; // import purchase-related routes from purchaseCourse.route.js
import courseProgressRoute from "./routes/courseProgress.route.js"; // import course progress-related routes from courseProgress.route.js

dotenv.config({}); // call config method of dotenv with an empty object argument to load environment variables from .env file into process.env

connectDB(); // call connectDB function to establish a connection to the MongoDB database

const app = express(); // create an instance of express application and store it in variable app

const PORT = process.env.PORT || 3000; // assign port number from environment variable PORT if available, otherwise use 3000 as default

app.use(express.json()); // use express.json middleware to parse incoming JSON request bodies automatically
app.use(cookieParser()); // use cookieParser middleware to parse cookies in incoming HTTP requests

app.use( // use cors middleware with configuration object argument to enable cross-origin access
    cors({
        origin: "http://localhost:5173", // set origin property to allow requests from frontend running on localhost:5173
        credentials: true // set credentials property to true to allow cookies and authorization headers
    })
);

app.use("/api/v1/media", mediaRoute); // use mediaRoute for handling all requests that start with /api/v1/media
app.use("/api/v1/user", userRoute); // use userRoute for handling all requests that start with /api/v1/user
app.use("/api/v1/course", courseRoute); // use courseRoute for handling all requests that start with /api/v1/course
app.use("/api/v1/purchase", purchaseRoute); // use purchaseRoute for handling all requests that start with /api/v1/purchase
app.use("/api/v1/progress", courseProgressRoute); // use courseProgressRoute for handling all requests that start with /api/v1/progress

app.listen( // call listen method of express app to start server and listen for incoming connections
    PORT, // first argument specifies the port number to listen on
    () => { // second argument is a callback function executed after server starts
        console.log(`Server listen at port ${PORT}`); // log message to console showing active port number
    }
);