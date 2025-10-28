import React from 'react' // import react library to enable JSX and component creation
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover' // import popover components to manage dropdown interactions
import { Button } from '../ui/button' // import button component to use consistent styled buttons
import { Avatar, AvatarImage } from '../ui/avatar' // import avatar components to display user profile images
import { LogOut, User2 } from 'lucide-react' // import icons to represent logout and user actions visually
import { Link, useNavigate } from 'react-router-dom' // import link for navigation and useNavigate hook for redirection logic
import { useDispatch, useSelector } from 'react-redux' // import useSelector to read data from redux store state and useDispatch to send actions that update the store
import axios from 'axios' // import axios to perform http requests
import { USER_API_END_POINT } from '@/utils/constant' // import constant defining base url for user-related api endpoints
import { setUser } from '@/redux/authSlice' // import redux action creator to update user state
import { toast } from 'sonner' // import toast utility to display user notifications

const Navbar = () => { // define functional component 'Navbar' to render the main navigation bar
    const { user } = useSelector( // extract user object from redux store using useSelector hook
        store => store.auth // access auth slice to retrieve authentication-related state
    )
    const dispatch = useDispatch() // create dispatch function to send actions to redux store
    const navigate = useNavigate() // create navigate function to programmatically redirect users

    const logoutHandler = async () => { // define asynchronous function to handle logout process
        try { // use try block to execute logout request safely
            const res = await axios.get( // send a get request to backend logout endpoint
                `${USER_API_END_POINT}/logout`, // construct complete logout url using constant base path
                { withCredentials: true } // include cookies in request for session-based authentication
            )
            if (res.data.success) { // check response to confirm successful logout
                dispatch(setUser(null)) // update redux state to remove stored user data
                navigate("/") // redirect user to homepage after logout
                toast.success(res.data.message) // show success notification with message from server
            }
        } catch (error) { // catch failed logout attempt if any
            console.log(error) // output error to console for debugging
            toast.error(error.response.data.message) // show error message notification to user
        }
    }

    return ( // return jsx for rendering navbar structure
        <div className='bg-white'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
                <div>
                    <h1 className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h1>
                </div>
                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {
                            user && user.role === 'recruiter' ? ( // check if logged-in user is recruiter to show recruiter-specific links
                                <>
                                    <li><Link to="/admin/companies">Companies</Link></li>
                                    <li><Link to="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : ( // if not recruiter, show general navigation links
                                <>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/jobs">Jobs</Link></li>
                                    <li><Link to="/browse">Browse</Link></li>
                                </>
                            )
                        }
                    </ul>
                    {
                        !user ? ( // check if no user is logged in to show authentication buttons
                            <div className='flex items-center gap-2'>
                                <Link to="/login"><Button variant="outline">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
                            </div>
                        ) : ( // if user exists, display profile and logout popover
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" /> // dynamically render user profile photo if available
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" /> // show same profile image inside popover for identity consistency
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>{user?.fullname}</h4> // display user's full name fetched from state
                                                <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p> // display user's short bio for context
                                            </div>
                                        </div>
                                        <div className='flex flex-col my-2 text-gray-600'>
                                            {
                                                user && user.role === 'student' && ( // conditionally render profile link for student users
                                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                        <User2 /> // display user icon to represent profile
                                                        <Button variant="link"> <Link to="/profile">View Profile</Link></Button> // link button to open user's profile page
                                                    </div>
                                                )
                                            }
                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <LogOut /> // display logout icon beside button for better visual cue
                                                <Button 
                                                    onClick={logoutHandler} // attach logoutHandler to perform logout on click
                                                    variant="link"
                                                >
                                                    Logout
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar // export navbar component as default so it can be imported elsewhere