import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom' // from 'react-router-dom' library, import 'Link' component to create links to different routes and 'useNavigate' hook to actually navigate to different routes
import { useDispatch, useSelector } from 'react-redux' // import 'useDispatch' hook to dispatch actions to redux store and 'useSelector' hook to select state from the Redux store
import axios from 'axios' // import 'axios' library to make HTTP requests to the backend
import { USER_API_END_POINT } from '@/utils/constant' // import URL of the backend to send requests to
import { setUser } from '@/redux/authSlice' // import 'setUser' function from 'authSlice' to update value of user authentication related state
import { toast } from 'sonner' // import 'toast' to render pop-up messages

const Navbar = () => { // create a functional component called 'Navbar' to render navigation bar
    const { user } = useSelector(store => store.auth) // use 'useSelector' hook to access and 'user' state from 'auth' part of redux store
    
        const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to navigate users to different routes
        
        const dispatch = useDispatch() // create an instace of 'useDispatch' hook to dispatch actions to redux store to update values of states

    const logoutHandler = async () => { //create a function called 'logoutHandler' to log out the user
        try {
            const res = await axios.get( // make a GET request to the backend using 'axios' library
                `${USER_API_END_POINT}/logout`, // this is the backend URL to make GET request to
                { withCredentials: true } // send cookies to the backend along with the form fields data for authentication
            )

            if (res.data.success) { // if data is sent to the backend successfully
                dispatch(setUser(null)) // dispatch null to 'user' state using 'setUser' function to remove the user
                navigate("/") // navigate user to home page
                toast.success(res.data.message) // whatever message the backend sent as response, show it as a pop-up message
            }
        } catch (error) { // if any error occurs while submitting the login form details
            console.log(error) // log the error to the console to know what error occured
            toast.error(error.response.data.message) // whatever error message the backend sent as response, show it as a pop-up message
        }
    }

    return (
        <div className='bg-white'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
                <div>
                    <h1 className='text-2xl font-bold'>
                        Job<span className='text-[#F83002]'>Portal</span>
                    </h1>
                </div>
                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {
                            // if user is available and is a recruiter, render two links to companies and jobs page
                            // if user is available and is a job seeker, render three links to home, jobs, and browse page
                            
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies">Companies</Link></li>
                                    <li><Link to="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/jobs">Jobs</Link></li>
                                    <li><Link to="/browse">Browse</Link></li>
                                </>
                            )
                        }
                    </ul>
                    {
                        !user ? ( // if user is not available, render links to login and signup page
                            <div className='flex items-center gap-2'>
                                <Link to="/login">
                                    <Button variant="outline">Login</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">
                                        Signup
                                    </Button>
                                </Link>
                            </div>
                        ) : ( // if user is available, render the following JSX
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" /> {/* render user's profile picture */}
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" /> {/* render user's profile picture */}
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>{user?.fullname}</h4> {/* render user's full name */}
                                                <p className='text-sm text-muted-foreground'>{user?.profile?.bio} </p> {/* render user's bio */}
                                            </div>
                                        </div>
                                        <div className='flex flex-col my-2 text-gray-600'>
                                            {
                                                user && user.role === 'student' && ( // if user exists and is a job seeker, render a link to go to it's profile
                                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                        <User2 />
                                                        <Button variant="link">
                                                            <Link to="/profile">View Profile</Link>
                                                        </Button>
                                                    </div>
                                                )
                                            }
                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <LogOut />
                                                <Button
                                                    onClick={logoutHandler} // clicking this button calls 'logoutHandler' function
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