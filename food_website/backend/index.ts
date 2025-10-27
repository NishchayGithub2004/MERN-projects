import express from "express" // import the express module to create the server and handle routes
import dotenv from "dotenv" // import dotenv to load environment variables from a .env file
import connectDB from "./db/connectDB" // import function to connect to the database
import bodyParser from "body-parser" // import body-parser middleware to parse incoming request bodies
import cookieParser from "cookie-parser" // import cookie-parser middleware to parse cookies
import cors from "cors" // import cors middleware to handle Cross-Origin Resource Sharing
import userRoute from "./routes/user.route" // import user-related routes
import restaurantRoute from "./routes/restaurant.route" // import restaurant-related routes
import menuRoute from "./routes/menu.route" // import menu-related routes
import orderRoute from "./routes/order.route" // import order-related routes

dotenv.config() // load environment variables from the .env file into process.env

const app = express() // create an instance of the express application

const PORT = process.env.PORT || 3000 // define the port to run the server on, fallback to 3000 if not specified

app.use(bodyParser.json({ limit: '10mb' })) // parse incoming JSON request bodies with a size limit of 10mb
app.use(express.urlencoded({ extended: true, limit: '10mb' })) // parse URL-encoded data with extended syntax and size limit
app.use(express.json()) // parse incoming JSON request bodies (redundant with bodyParser.json but included)
app.use(cookieParser()) // parse cookies attached to incoming requests

const corsOptions = { // define options for CORS middleware
    origin: "https://food-app-yt.onrender.com", // allow requests only from this origin
    credentials: true // allow credentials such as cookies to be sent
}
app.use(cors(corsOptions)) // apply CORS middleware with the defined options

app.use("/api/v1/user", userRoute) // mount user routes at "/api/v1/user"
app.use("/api/v1/restaurant", restaurantRoute) // mount restaurant routes at "/api/v1/restaurant"
app.use("/api/v1/menu", menuRoute) // mount menu routes at "/api/v1/menu"
app.use("/api/v1/order", orderRoute) // mount order routes at "/api/v1/order"

app.listen(PORT, () => { // start the server on the specified port
    connectDB() // connect to the database when the server starts
    console.log(`Server listen at port ${PORT}`) // log a message indicating the server is running
})
