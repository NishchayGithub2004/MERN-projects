import React, { useEffect, useState } from 'react' // import React for JSX support and useEffect/useState hooks for side effects and state management
import { useDispatch, useSelector } from 'react-redux' // import useDispatch to dispatch Redux actions and useSelector to access Redux store state
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar' // import avatar components for displaying user profile images
import { setSelectedUser } from '@/redux/authSlice' // import Redux action to set the selected user
import { Input } from './ui/input' // import input component for message typing field
import { Button } from './ui/button' // import button component for sending messages
import { MessageCircleCode } from 'lucide-react' // import message icon component from lucide-react
import Messages from './Messages' // import Messages component to display chat messages
import axios from 'axios' // import axios to perform HTTP requests
import { setMessages } from '@/redux/chatSlice' // import Redux action to update the messages state

const ChatPage = () => { // define a function component ChatPage to render chat interface and manage chat logic
    const [textMessage, setTextMessage] = useState("") // define a state variable textMessage with initial value "" to store message input

    const { user, suggestedUsers, selectedUser } = useSelector( // destructure user, suggestedUsers, and selectedUser from Redux auth state
        store => store.auth // access the auth slice of the Redux store
    )

    const users = Array.isArray(suggestedUsers) ? suggestedUsers : [];

    const { onlineUsers, messages } = useSelector( // destructure onlineUsers and messages from Redux chat state
        store => store.chat // access the chat slice of the Redux store
    )

    const dispatch = useDispatch() // create dispatch reference to trigger Redux actions

    const sendMessageHandler = async (receiverId) => { // define an async function sendMessageHandler to send message to a given receiverId
        try {
            const res = await axios.post( // send POST request to the server to send a message
                `http://localhost:8080/api/v1/message/send/${receiverId}`, // dynamic URL containing receiverId for targeted message
                { textMessage }, // send textMessage as the body payload of the POST request
                {
                    headers: { 'Content-Type': 'application/json' }, // specify JSON content type for request header
                    withCredentials: true // include cookies in request for authentication
                }
            )

            if (res.data.success) { // check if the response indicates message sent successfully
                dispatch( // call Redux dispatch function to update the chat messages in global state
                    setMessages([...messages, res.data.newMessage]) // add the new message to existing messages array using spread syntax
                )
                setTextMessage("") // reset textMessage input field to empty string after successful send
            }
        } catch (error) { // catch block to handle errors during request
            console.log(error) // log error details in console
        }
    }

    useEffect(() => { // define a side effect that runs once when component mounts
        return () => { // define cleanup function executed when component unmounts
            dispatch(setSelectedUser(null)) // dispatch Redux action to clear selected user from state on unmount
        }
    }, []) // empty dependency array ensures this runs only once on mount and cleanup on unmount

    return ( // start JSX return statement
        <div className='flex ml-[16%] h-screen'>
            <section className='w-full md:w-1/4 my-8'>
                <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
                <hr className='mb-4 border-gray-300' />
                <div className='overflow-y-auto h-[80vh]'>
                    {
                        users.map((suggestedUser) => { // iterate through suggestedUsers array to render each suggested user
                            const isOnline = onlineUsers.includes(suggestedUser?._id) // check if the current suggested user is present in onlineUsers array
                            return (
                                <div onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'>
                                    <Avatar className='w-14 h-14'>
                                        <AvatarImage src={suggestedUser?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>{suggestedUser?.username}</span>
                                        <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'} `}>{isOnline ? 'online' : 'offline'}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </section>
            {
                selectedUser ? ( // conditionally render chat section if a selectedUser exists
                    <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
                        <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <span>{selectedUser?.username}</span>
                            </div>
                        </div>
                        <Messages selectedUser={selectedUser} /> {/* pass selectedUser as prop to Messages component for message rendering */}
                        <div className='flex items-center p-4 border-t border-t-gray-300'>
                            <Input 
                                value={textMessage} // bind input value to textMessage state for controlled input
                                onChange={(e) => setTextMessage(e.target.value)} // update textMessage on input change using event target value
                                type="text"
                                className='flex-1 mr-2 focus-visible:ring-transparent'
                                placeholder="Messages..."
                            />
                            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button> {/* call sendMessageHandler on click passing selectedUser._id */}
                        </div>
                    </section>
                ) : ( // render empty state if no user selected
                    <div className='flex flex-col items-center justify-center mx-auto'>
                        <MessageCircleCode className='w-32 h-32 my-4' />
                        <h1 className='font-medium'>Your messages</h1>
                        <span>Send a message to start a chat.</span>
                    </div>
                )
            }
        </div>
    )
}

export default ChatPage
