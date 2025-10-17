import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react' // import icons used in sidebar for visual representation of actions
import React, { useState } from 'react' // import React and useState hook to manage local component state
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar' // import avatar components to display user profile pictures
import { toast } from 'sonner' // import toast to show success or error notifications
import axios from 'axios' // import axios to make HTTP requests
import { useNavigate } from 'react-router-dom' // import useNavigate hook to programmatically navigate between routes
import { useDispatch, useSelector } from 'react-redux' // import Redux hooks for dispatching actions and selecting store state
import { setAuthUser } from '@/redux/authSlice' // import action to update authenticated user in Redux store
import CreatePost from './CreatePost' // import CreatePost component to allow creating new posts
import { setPosts, setSelectedPost } from '@/redux/postSlice' // import Redux actions to update posts and selected post state
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover' // import popover components for notifications dropdown
import { Button } from './ui/button' // import button component for clickable UI elements

const LeftSidebar = () => { // define a function component LeftSidebar to render sidebar and handle navigation/logout logic
    const navigate = useNavigate(); // initialize navigate function for programmatic navigation
    
    const { user } = useSelector(store => store.auth); // select user object from auth slice of Redux store
    
    const { likeNotification } = useSelector(store => store.realTimeNotification); // select likeNotification array from realTimeNotification slice of Redux store
    
    const dispatch = useDispatch(); // initialize dispatch function to dispatch Redux actions
    
    const [open, setOpen] = useState(false); // define a local state open to track whether CreatePost modal is open

    const logoutHandler = async () => { // define async function logoutHandler to handle user logout
        try {
            const res = await axios.get('http://localhost:8080/api/v1/user/logout', { withCredentials: true }); // send GET request to logout API with credentials
            if (res.data.success) { // check if logout was successful
                dispatch(setAuthUser(null)); // reset authenticated user in Redux store
                dispatch(setSelectedPost(null)); // reset selected post in Redux store
                dispatch(setPosts([])); // reset posts array in Redux store
                navigate("/login"); // navigate user to login page
                toast.success(res.data.message); // show success toast notification
            }
        } catch (error) {
            toast.error(error.response.data.message); // show error toast if logout fails
        }
    }

    const sidebarHandler = (textType) => { // define a function sidebarHandler to handle sidebar item clicks with argument textType
        if (textType === 'Logout') { // check if clicked item is Logout
            logoutHandler(); // call logoutHandler
        } else if (textType === "Create") { // check if clicked item is Create
            setOpen(true); // open CreatePost modal
        } else if (textType === "Profile") { // check if clicked item is Profile
            navigate(`/profile/${user?._id}`); // navigate to user's profile page
        } else if (textType === "Home") { // check if clicked item is Home
            navigate("/"); // navigate to homepage
        } else if (textType === 'Messages') { // check if clicked item is Messages
            navigate("/chat"); // navigate to chat page
        }
    }

    const sidebarItems = [ // define an array sidebarItems containing objects for each sidebar item with icon and text
        { icon: <Home />, text: "Home" }, // Home item with Home icon
        { icon: <Search />, text: "Search" }, // Search item with Search icon
        { icon: <TrendingUp />, text: "Explore" }, // Explore item with TrendingUp icon
        { icon: <MessageCircle />, text: "Messages" }, // Messages item with MessageCircle icon
        { icon: <Heart />, text: "Notifications" }, // Notifications item with Heart icon
        { icon: <PlusSquare />, text: "Create" }, // Create item with PlusSquare icon
        {
            icon: ( // Profile item with user avatar as icon
                <Avatar className='w-6 h-6'>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" /> {/* show user's profile picture */}
                    <AvatarFallback>CN</AvatarFallback> {/* fallback initials if image fails */}
                </Avatar>
            ),
            text: "Profile" // text label for Profile
        },
        { icon: <LogOut />, text: "Logout" }, // Logout item with LogOut icon
    ]

    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className='flex flex-col'>
                <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
                <div>
                    {
                        sidebarItems.map((item, index) => { // map over sidebarItems array to render each item
                            return (
                                <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                                    {item.icon} {/* render icon for sidebar item */}
                                    <span>{item.text}</span> {/* render text label for sidebar item */}
                                    {
                                        item.text === "Notifications" && likeNotification.length > 0 && ( // conditionally render notifications popover if Notifications item and likeNotification array is not empty
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification.length}</Button> {/* show notification count in red button */}
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div>
                                                        {
                                                            likeNotification.length === 0 ? (<p>No new notification</p>) : ( // if no notifications, show message
                                                                likeNotification.map((notification) => { // otherwise, map through notifications array
                                                                    return (
                                                                        <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                            <Avatar> {/* show avatar of user who liked */}
                                                                                <AvatarImage src={notification.userDetails?.profilePicture} /> {/* user's profile picture */}
                                                                                <AvatarFallback>CN</AvatarFallback> {/* fallback initials */}
                                                                            </Avatar>
                                                                            <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p> {/* notification message */}
                                                                        </div>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} /> {/* render CreatePost component and pass open state and setOpen function as props */}
        </div>
    )
}

export default LeftSidebar // export LeftSidebar component as default export
