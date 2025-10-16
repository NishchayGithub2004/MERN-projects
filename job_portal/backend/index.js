import express from "express"; // import express to create the server and define routes
import cookieParser from "cookie-parser"; // import cookie-parser to parse cookies from incoming requests
import cors from "cors"; // import cors to enable Cross-Origin Resource Sharing
import dotenv from "dotenv"; // import dotenv to load environment variables from .env file
import connectDB from "./utils/db.js"; // import the function to connect to MongoDB
import userRoute from "./routes/user.route.js"; // import user routes
import companyRoute from "./routes/company.route.js"; // import company routes
import jobRoute from "./routes/job.route.js"; // import job routes
import applicationRoute from "./routes/application.route.js"; // import application routes

dotenv.config({}); // load environment variables from .env file

const app = express(); // create an express application instance

app.use(express.json()); // middleware to parse incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // middleware to parse URL-encoded payloads
app.use(cookieParser()); // middleware to parse cookies from requests

const corsOptions = { // define CORS configuration options
    origin: 'http://localhost:5173', // allow requests from this origin
    credentials: true // allow sending cookies and authentication headers
}

app.use(cors(corsOptions)); // enable CORS with the defined options

const PORT = process.env.PORT || 3000; // get the port from environment variables or default to 3000

app.use("/api/v1/user", userRoute); // mount user routes at /api/v1/user
app.use("/api/v1/company", companyRoute); // mount company routes at /api/v1/company
app.use("/api/v1/job", jobRoute); // mount job routes at /api/v1/job
app.use("/api/v1/application", applicationRoute); // mount application routes at /api/v1/application

app.listen(PORT, () => { // start the server and listen on the defined port
    connectDB(); // connect to the MongoDB database when the server starts
    console.log(`Server running at port ${PORT}`); // log a message indicating the server is running
});
