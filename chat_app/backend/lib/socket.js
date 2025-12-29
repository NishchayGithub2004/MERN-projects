import { Server } from "socket.io"; // import Server to create and manage a Socket.IO server instance
import http from "http"; // import http to create a raw HTTP server required by Socket.IO
import express from "express"; // import express to initialize the application instance
import { ENV } from "./env.js"; // import environment configuration to access client URL and other runtime settings
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js"; // import socket authentication middleware to validate users before allowing socket connections

const app = express(); // create an express application instance to attach to the HTTP server

const server = http.createServer(app); // create an HTTP server using the express app as the request handler

const io = new Server(server, { // create a Socket.IO server instance bound to the HTTP server
    cors: { // configure CORS settings to control allowed client origins
        origin: [ENV.CLIENT_URL], // allow socket connections only from the configured client URL
        credentials: true, // allow credentials such as cookies or auth headers in socket requests
    },
});

io.use(socketAuthMiddleware); // apply authentication middleware to all incoming socket connections

export function getReceiverSocketId(userId) { // define a helper function to retrieve a user's active socket id using their user id
    return userSocketMap[userId]; // return the socket id mapped to the given user id if present
}

const userSocketMap = {}; // maintain an in-memory map of user ids to their active socket ids

io.on("connection", (socket) => { // listen for new socket connections from authenticated users
    console.log("A user connected", socket.user.fullName); // log a message indicating a user has successfully connected

    const userId = socket.userId; // extract the authenticated user's id from the socket object
    
    userSocketMap[userId] = socket.id; // store the user's socket id to track their online presence

    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // broadcast the list of currently online user ids to all clients

    socket.on("disconnect", () => { // listen for the socket disconnect event when a user goes offline
        console.log("A user disconnected", socket.user.fullName); // log a message indicating the user has disconnected
        delete userSocketMap[userId]; // remove the user's socket mapping to reflect offline status
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // broadcast the updated list of online users to all clients
    });
});

export { io, app, server };