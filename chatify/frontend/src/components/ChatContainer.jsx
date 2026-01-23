import { useEffect, useRef } from "react"; // import 'useEffect' hook to run side-effects and 'useRef' hook to create a direct reference to a DOM element
import { useAuthStore } from "../store/useAuthStore"; // import custom hook 'useAuthStore' to access authentication related states and functions
import { useChatStore } from "../store/useChatStore"; // import custom hook 'useChatStore' to access chat related states and functions
import ChatHeader from "./ChatHeader"; // import 'ChatHeader' component to render chat header like contact name, profile picture, and online status
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder"; // import 'NoChatHistoryPlaceholder' component to render a placeholder when there is no chat history with a contact
import MessageInput from "./MessageInput"; // import 'MessageInput' component to render input field and send button for sending messages
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton"; // import 'MessagesLoadingSkeleton' component to render a loading UI when fetching messages

function ChatContainer() { // create a functional component named 'ChatContainer' to render chat UI
    const { selectedUser, getMessagesByUserId, messages, isMessagesLoading, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
    // extract all states and functions from custom hook 'useChatStore'
    
    const { authUser } = useAuthStore(); // extract 'authUser' state from custom hook 'useAuthStore' to get current authenticated user
    
    const messageEndRef = useRef(null); // create a ref object to get a direct reference to a message, initially null since it initially doesn't refer to any message

    useEffect(() => {
        getMessagesByUserId(selectedUser._id); // fetch messages of the selected user using it's unique ID
        
        subscribeToMessages(); // call 'subscribeToMessages' function to subscribe to real-time updates of messages

        return () => unsubscribeFromMessages(); // cleanup function to unsubscribe from real-time updates of messages
    }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]); // re-run this effect whenever any of these dependencies change

    // create a side-effect to scroll smoothly to a message having a direct reference, re-run this effect whenever 'messages' state changes ie some other message is referred to

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <>
            <ChatHeader />
            
            <div className="flex-1 px-6 overflow-y-auto py-8">
                {messages.length > 0 && !isMessagesLoading ? ( // if messages have been loaded and there are messages available to render
                    <div className="max-w-3xl mx-auto space-y-6">
                        {messages.map((msg) => ( // iterate over 'messages' array as 'msg'
                            <div
                                key={msg._id} // unique ID of message is unique identifier of this message
                                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                                // apply styles based on whether message is sent by current authenticated user or not by checking if sender's ID of message is same as ID of current authenticated user
                            >
                                <div
                                    className={`chat-bubble relative ${msg.senderId === authUser._id // apply styles based on whether message is sent by current authenticated user or not by checking if sender's ID of message is same as ID of current authenticated user
                                            ? "bg-cyan-600 text-white"
                                            : "bg-slate-800 text-slate-200"
                                        }`}
                                >
                                    {/* if message contains an image, render it */}
                                    {msg.image && (
                                        <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover" />
                                    )}
                                    
                                    {/* if message contains text, render it */}
                                    {msg.text && (
                                        <p className="mt-2">{msg.text}</p>
                                    )}
                                    
                                    <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                                        {/* render the date message was created at, undefined function since nothing extra needs to be done, hour and minute rendered in 2 digits */}
                                        {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        
                        <div ref={messageEndRef} /> {/* create a direct reference to the most recent message in the chat */}
                    </div>
                ) : isMessagesLoading ? (
                    <MessagesLoadingSkeleton /> // if messages are still loading, render 'MessagesLoadingSkeleton' component
                ) : (
                    <NoChatHistoryPlaceholder name={selectedUser.fullName} /> // if no messages are available to render, render 'NoChatHistoryPlaceholder' component with contact' name passed as a prop
                )}
            </div>

            <MessageInput />
        </>
    );
}

export default ChatContainer;