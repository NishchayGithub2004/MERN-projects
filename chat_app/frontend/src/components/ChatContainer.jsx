import { useEffect, useRef } from "react"; // import React hooks to handle side effects and persist mutable values across renders
import { useAuthStore } from "../store/useAuthStore"; // import auth store hook to access authenticated user state
import { useChatStore } from "../store/useChatStore"; // import chat store hook to manage chat-related state and actions
import ChatHeader from "./ChatHeader"; // import chat header component to display selected user and chat metadata
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder"; // import placeholder component to show when no chat history exists
import MessageInput from "./MessageInput"; // import input component to allow the user to send new messages
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton"; // import loading skeleton component to indicate messages are being fetched

function ChatContainer() { // define a functional component named 'ChatContainer' to manage chat lifecycle, state coordination, and message rendering
    // retrieve chat-related state values and actions from the chat store in a single hook call
    const {
        selectedUser, // store the currently selected chat user to determine which conversation is active
        getMessagesByUserId, // store function to fetch messages for a specific user from backend or store
        messages, // store the list of messages associated with the selected user
        isMessagesLoading, // store loading flag to control skeletons or placeholders while messages are being fetched
        subscribeToMessages, // store function to start listening for real-time incoming messages
        unsubscribeFromMessages, // store function to stop listening for real-time messages to avoid memory leaks
    } = useChatStore();
    
    const { authUser } = useAuthStore(); // extract authenticated user information to identify message sender and permissions
    
    const messageEndRef = useRef(null); // create a ref to track the last message element for automatic scroll positioning

    useEffect(() => { // run side effects when the selected user or chat dependencies change
        getMessagesByUserId(selectedUser._id); // fetch all messages associated with the currently selected user's id
        
        subscribeToMessages(); // initiate real-time subscription to incoming messages for the active chat

        return () => unsubscribeFromMessages(); // clean up message subscription when component unmounts or dependencies change
    }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]); // re-run effect when chat context or handlers change

    useEffect(() => { // run side effect whenever the messages array updates
        if (messageEndRef.current) { // ensure the reference to the last message DOM node exists
            messageEndRef.current.scrollIntoView({ behavior: "smooth" }); // automatically scroll to the latest message with smooth animation
        }
    }, [messages]); // trigger scrolling logic whenever new messages are added

    return ( // return JSX to render the chat UI based on current chat and loading state
        <>
            <ChatHeader /> {/* render chat header for the currently selected conversation */}
    
            <div className="flex-1 px-6 overflow-y-auto py-8">
                {messages.length > 0 && !isMessagesLoading ? ( // conditionally render messages when data exists and is not loading
                    <div className="max-w-3xl mx-auto space-y-6">
                        {messages.map((msg) => ( // iterate over messages array to render each message bubble
                            <div
                                key={msg._id} // assign unique key to help React efficiently reconcile list items
                                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`} // align message bubble based on whether the message was sent by the authenticated user
                            >
                                <div
                                    className={`chat-bubble relative ${msg.senderId === authUser._id
                                            ? "bg-cyan-600 text-white"
                                            : "bg-slate-800 text-slate-200"
                                        }`} // dynamically apply bubble styling depending on message ownership
                                >
                                    {msg.image && ( // conditionally render image only if message contains an image
                                        <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover" />
                                    )}
    
                                    {msg.text && <p className="mt-2">{msg.text}</p>} // conditionally render text content if present in the message
    
                                    <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                                        {new Date(msg.createdAt).toLocaleTimeString(undefined, { // format and display message timestamp for user readability
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
    
                        <div ref={messageEndRef} /> {/* anchor element used to auto-scroll to the latest message */}
                    </div>
                ) : isMessagesLoading ? ( // render loading state when messages are being fetched
                    <MessagesLoadingSkeleton />
                ) : ( // render placeholder when no messages exist for the selected user
                    <NoChatHistoryPlaceholder name={selectedUser.fullName} /> // pass selected user's name to personalize empty chat state
                )}
            </div>
    
            <MessageInput /> {/* render input field to allow the user to send new messages */}
        </>
    );    
}

export default ChatContainer;