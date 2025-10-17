import React from 'react' // import React to use JSX
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar' // import avatar components to display user profile pictures
import { Button } from './ui/button' // import Button component for clickable actions
import { Link } from 'react-router-dom' // import Link for navigation between routes
import { useSelector } from 'react-redux' // import useSelector hook to select state from Redux store
import useGetAllMessage from '@/hooks/useGetAllMessage' // import custom hook to fetch all chat messages
import useGetRTM from '@/hooks/useGetRTM' // import custom hook to connect to real-time messaging (RTM)

const Messages = ({ selectedUser }) => { // define a function component Messages to render chat messages and selected user info, with prop selectedUser
    useGetRTM(); // call custom hook to initialize real-time messaging connection
    
    useGetAllMessage(); // call custom hook to fetch all messages from Redux or API
    
    const { messages } = useSelector(store => store.chat); // select messages array from chat slice of Redux store
    
    const { user } = useSelector(store => store.auth); // select current authenticated user from auth slice of Redux store
    
    return (
        <div className='overflow-y-auto flex-1 p-4'>
            <div className='flex justify-center'>
                <div className='flex flex-col items-center justify-center'>
                    <Avatar className="h-20 w-20"> {/* display selected user's avatar */}
                        <AvatarImage src={selectedUser?.profilePicture} alt='profile' /> {/* show selectedUser profile picture */}
                        <AvatarFallback>CN</AvatarFallback> {/* fallback initials if image fails */}
                    </Avatar>
                    <span>{selectedUser?.username}</span> {/* display selectedUser username */}
                    <Link to={`/profile/${selectedUser?._id}`}><Button className="h-8 my-2" variant="secondary">View profile</Button></Link> {/* navigate to selectedUser profile page */}
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                {
                    messages && messages.map((msg) => { // iterate over messages array to display each message
                        return (
                            <div key={msg._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}> {/* align message to right if sent by current user, left otherwise */}
                                <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}> {/* style message bubble differently based on sender */}
                                    {msg.message} {/* display message text */}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Messages // export Messages component as default export
