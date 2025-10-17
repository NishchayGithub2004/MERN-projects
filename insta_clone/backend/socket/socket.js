import { Server } from "socket.io"; // import the Server class from the socket.io library to create a WebSocket server instance
import express from "express"; // import express to create an HTTP server and handle middleware
import http from "http"; // import the built-in http module to create an HTTP server instance

const app = express(); // create an Express application instance to handle requests and responses

const server = http.createServer(app); // create an HTTP server by passing the Express app instance so it can handle both HTTP and WebSocket connections

const io = new Server( // create a new socket.io Server instance to enable WebSocket communication
    server, // pass the HTTP server instance so socket.io can bind to the same server
    { // configure additional options for socket.io
        cors: { // define CORS (Cross-Origin Resource Sharing) settings
            origin: process.env.URL, // allow requests only from the URL specified in the environment variable
            methods: ['GET', 'POST'] // allow only GET and POST methods for socket connections
        }
    }
);

const userSocketMap = {}; // create an object to store mappings between user IDs and their corresponding socket IDs

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId]; // define and export a function to get the socket ID of a specific receiver by using their userId as the key in userSocketMap

io.on( // define an event listener on the io instance to handle new client connections
    'connection', // specify the 'connection' event which is emitted when a new client connects
    (socket) => { // define a callback function that receives the connected client's socket object
        const userId = socket.handshake.query.userId; // extract the userId from the handshake query parameters sent by the client during connection
        
        if (userId) { // check if the userId exists
            userSocketMap[userId] = socket.id; // map the userId to the socket.id to keep track of the connected user
        }

        io.emit( // broadcast an event to all connected clients
            'getOnlineUsers', // specify the event name 'getOnlineUsers' to notify clients about online users
            Object.keys(userSocketMap) // send an array of currently connected userIds by getting keys from userSocketMap
        );

        socket.on( // define an event listener on the socket object for when the client disconnects
            'disconnect', // specify the 'disconnect' event which triggers when the client disconnects
            () => { // define the callback to handle disconnection
                if (userId) { // check if the disconnected socket had an associated userId
                    delete userSocketMap[userId]; // remove the userId from userSocketMap to reflect disconnection
                }
                
                io.emit( // broadcast an updated list of online users to all clients
                    'getOnlineUsers', // specify the same event name to update online users
                    Object.keys(userSocketMap) // send the updated array of userIds
                );
            }
        );
    }
);

export { app, server, io }; // export the app, server, and io instances for use in other parts of the application
