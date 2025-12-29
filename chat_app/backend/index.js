import express from "express"; // import express to create and configure the HTTP application server
import cookieParser from "cookie-parser"; // import cookie-parser to read and parse cookies from incoming requests
import path from "path"; // import path to resolve and manipulate filesystem paths safely
import cors from "cors"; // import cors to configure cross-origin resource sharing rules
import authRoutes from "./routes/auth.route.js"; // import authentication routes to handle signup, login, and logout APIs
import messageRoutes from "./routes/message.route.js"; // import message routes to handle chat and messaging-related APIs
import { connectDB } from "./lib/db.js"; // import connectDB to establish a connection with the MongoDB database
import { ENV } from "./lib/env.js"; // import environment configuration to access runtime variables like port and client URL
import { app, server } from "./lib/socket.js"; // import the express app and HTTP server configured with socket.io

const __dirname = path.resolve(); // resolve the absolute directory path for use in static file serving

const PORT = ENV.PORT || 3000; // determine the server port from environment variables or fallback to 3000

app.use(express.json({ limit: "5mb" })); // enable JSON body parsing with a size limit to handle large payloads safely
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true })); // configure CORS to allow requests from the client URL with credentials
app.use(cookieParser()); // enable cookie parsing middleware to access cookies on incoming requests

app.use("/api/auth", authRoutes); // mount authentication routes under the /api/auth namespace
app.use("/api/messages", messageRoutes); // mount message-related routes under the /api/messages namespace

if (ENV.NODE_ENV === "production") { // check whether the application is running in a production environment
    app.use(express.static(path.join(__dirname, "../frontend/dist"))); // serve static frontend assets from the built dist directory

    app.get("*", (_, res) => { // define a catch-all route to support client-side routing
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html")); // send the frontend index.html for unmatched routes
    });
}

server.listen(PORT, () => { // start the HTTP and socket server listening on the configured port
    console.log("Server running on port: " + PORT); // log server startup confirmation with the active port
    connectDB(); // initiate the database connection once the server is running
});