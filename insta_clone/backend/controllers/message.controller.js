import { Conversation } from "../models/conversation.model.js"; // import the Conversation model to manage chat conversation documents from MongoDB
import { getReceiverSocketId, io } from "../socket/socket.js"; // import helper function to get receiver’s socket ID and the io instance for real-time communication
import { Message } from "../models/message.model.js"; // import the Message model to handle message creation and retrieval from MongoDB

export const sendMessage = async ( // define an asynchronous function named sendMessage to handle sending messages between users
    req, // represents the HTTP request object containing client data such as params, body, and authentication info
    res // represents the HTTP response object used to send data back to the client
) => {
    try { // start a try block to safely handle runtime or database errors
        const senderId = req.id; // extract the sender’s user ID from the request object (assigned earlier by authentication middleware)
        
        const receiverId = req.params.id; // extract the receiver’s user ID from the request parameters
        
        const { textMessage: message } = req.body; // destructure the textMessage property from the request body and rename it to message for clarity

        let conversation = await Conversation.findOne({ // search the database for an existing conversation between sender and receiver
            participants: { $all: [senderId, receiverId] } // use MongoDB’s $all operator to check if both user IDs exist in the participants array
        });
        
        if (!conversation) { // check if no existing conversation was found
            conversation = await Conversation.create({ // create a new conversation document in the database
                participants: [senderId, receiverId] // initialize participants array with sender and receiver IDs
            });
        };
        
        const newMessage = await Message.create({ // create a new message document in the database
            senderId, // assign the sender’s user ID to track who sent the message
            receiverId, // assign the receiver’s user ID to track the recipient
            message // store the message text content
        });
        
        if (newMessage) conversation.messages.push(newMessage._id); // if message creation succeeded, push the message ID into the conversation’s messages array

        await Promise.all([ // execute multiple asynchronous save operations concurrently for efficiency
            conversation.save(), // save the updated conversation document with the new message reference
            newMessage.save() // save the new message document to persist it in the database
        ]);

        const receiverSocketId = getReceiverSocketId(receiverId); // get the receiver’s active socket ID using the helper function
        
        if (receiverSocketId) { // check if the receiver is currently online and connected via socket
            io.to(receiverSocketId).emit( // send a socket.io event to the receiver’s socket ID
                'newMessage', // specify the event name 'newMessage' to notify the receiver of a new message
                newMessage // send the newMessage object as the payload so the receiver can display it instantly
            );
        }

        return res.status(201).json({ // send a 201 (Created) HTTP response indicating the message was sent successfully
            success: true, // indicate the operation was successful
            newMessage // include the newly created message in the response payload
        });
    } catch (error) { // handle any runtime or database errors
        console.log(error); // log the error to the console for debugging
    }
};

export const getMessage = async ( // define an asynchronous function named getMessage to fetch message history between two users
    req, // represents the HTTP request object containing sender and receiver info
    res // represents the HTTP response object used to send back the conversation data
) => {
    try { // start a try block to handle possible runtime or database errors
        const senderId = req.id; // extract the sender’s user ID from the request object
        
        const receiverId = req.params.id; // extract the receiver’s user ID from the request parameters
        
        const conversation = await Conversation.findOne({ // search the database for an existing conversation between sender and receiver
            participants: { $all: [senderId, receiverId] } // use MongoDB’s $all operator to match both participants
        }).populate('messages'); // populate the messages field with actual message documents instead of just ObjectId references
        
        if (!conversation) return res.status(200).json({ // if no conversation is found, send a 200 OK response with an empty messages array
            success: true, // indicate the operation succeeded even though no messages were found
            messages: [] // send an empty list as there’s no conversation yet
        });

        return res.status(200).json({ // send a 200 OK response containing the conversation’s messages
            success: true, // indicate the operation was successful
            messages: conversation?.messages // return all populated message documents from the conversation
        });
    } catch (error) { // handle potential runtime or query errors
        console.log(error); // log the error to the console for debugging
    }
};
