import { Server } from "socket.io"; // import 'Server' class from 'socket.io' library to create and manage a socket.io server to handle real-time communication between client and server
import http from "http"; // import 'http' object from 'http' library to create a HTTP server to handle HTTP requests and responses
import express from "express"; // import 'express' object from 'express' library to map backend routes/URLs to HTTP requests and responses
import { ENV } from "./env.js"; // import 'ENV' object from 'env.js' file to access and use environment variables
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
// import 'socketAuthMiddleware' function from 'socket.auth.middleware.js' file to authenticate socket connections before allowing them to access the socket.io server

const app = express(); // create an instance of 'express' object to handle HTTP requests and responses

const server = http.createServer(app); // create an HTTP server using the 'createServer' method of the 'http' object and pass the 'app' object as an argument 
// to handle HTTP requests and responses for socket.io server

// create a new instance of 'Server' class to handle socket.io connections, pass 'server' object to it to know which HTTP server to use for socket.io connections,
// pass 'cors' object to it to specify which origins are allowed to connect to the socket.io server, pass value of 'CLIENT_URL' property to it 
// to specify which origins are allowed to connect to the socket.io server, pass 'credentials' property to true to allow credentials to be sent with the socket.io connections
// like JWT token so that it can be used to authenticate the socket.io connections
const io = new Server(server, {
    cors: {
        origin: [ENV.CLIENT_URL],
        credentials: true,
    },
});

io.use(socketAuthMiddleware); // use the 'socketAuthMiddleware' function on 'io' object to authenticate socket connections before allowing them to access the socket.io server

export function getReceiverSocketId(userId) { // create and export a function named 'getReceiverSocketId' to get the socket ID of the receiver of a message, it takes unique ID of the user as argument
    return userSocketMap[userId]; // return the value of user's given ID in 'userSocketMap' map which is the socket ID of the receiver of a message
}

const userSocketMap = {}; //

io.on("connection", (socket) => {
    console.log("A user connected", socket.user.fullName);

    const userId = socket.userId;
    
    userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.user.fullName);
        
        delete userSocketMap[userId];
        
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };