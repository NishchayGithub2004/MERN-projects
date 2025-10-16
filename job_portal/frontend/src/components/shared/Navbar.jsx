import React from 'react' // import React to enable JSX syntax and React component creation
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover' // import Popover-related components for dropdown UI
import { Button } from '../ui/button' // import Button component for styled button elements
import { Avatar, AvatarImage } from '../ui/avatar' // import Avatar components for displaying user profile pictures
import { LogOut, User2 } from 'lucide-react' // import icon components for logout and user actions
import { Link, useNavigate } from 'react-router-dom' // import Link for navigation links and useNavigate hook for programmatic navigation
import { useDispatch, useSelector } from 'react-redux' // import Redux hooks to access state and dispatch actions
import axios from 'axios' // import axios to make HTTP requests
import { USER_API_END_POINT } from '@/utils/constant' // import constant API endpoint for user-related routes
import { setUser } from '@/redux/authSlice' // import Redux action to update user state
import { toast } from 'sonner' // import toast for showing notifications to users

const Navbar = () => { // define a function component Navbar to render the navigation bar
    const { user } = useSelector( // destructure user object from Redux store using useSelector hook
        store => store.auth // access auth slice from the Redux store to retrieve authentication state
    )
    const dispatch = useDispatch() // initialize dispatch function to send actions to Redux store
    const navigate = useNavigate() // initialize navigate function to redirect users programmatically

    const logoutHandler = async () => { // define an asynchronous function logoutHandler to handle user logout logic
        try { // start try block to handle possible request errors
            const res = await axios.get( // make an asynchronous GET request using axios to log the user out
                `${USER_API_END_POINT}/logout`, // construct logout URL using constant endpoint
                { withCredentials: true } // send cookies along with request to maintain authentication context
            )
            
            if (res.data.success) { // check if logout request was successful using response data
                dispatch( // dispatch Redux action to update authentication state
                    setUser(null) // set user to null to clear user info from state
                )
                navigate("/") // navigate to homepage after successful logout
                toast.success(res.data.message) // show success toast notification using response message
            }
        } catch (error) { // handle any errors during logout process
            console.log(error) // log the error to console for debugging
            toast.error(error.response.data.message) // show error toast with message from server response
        }
    }

    return ( // return JSX structure for Navbar UI
        <div className='bg-white'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
                <div>
                    <h1 className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h1>
                </div>
                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {
                            user && user.role === 'recruiter' ? ( // check if user exists and has recruiter role to show recruiter options
                                <>
                                    <li><Link to="/admin/companies">Companies</Link></li>
                                    <li><Link to="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : ( // otherwise show general navigation links for other users
                                <>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/jobs">Jobs</Link></li>
                                    <li><Link to="/browse">Browse</Link></li>
                                </>
                            )
                        }
                    </ul>
                    {
                        !user ? ( // check if no user is logged in to show login/signup buttons
                            <div className='flex items-center gap-2'>
                                <Link to="/login"><Button variant="outline">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
                            </div>
                        ) : ( // if user exists, show user profile popover
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className=''>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>{user?.fullname}</h4>
                                                <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col my-2 text-gray-600'>
                                            {
                                                user && user.role === 'student' && ( // check if user is a student to show profile view option
                                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                        <User2 />
                                                        <Button variant="link"> <Link to="/profile">View Profile</Link></Button>
                                                    </div>
                                                )
                                            }
                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <LogOut />
                                                <Button 
                                                    onClick={logoutHandler} // attach logoutHandler function to button click event to log user out
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

export default Navbar
