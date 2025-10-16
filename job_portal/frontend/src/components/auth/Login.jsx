import React, { useEffect, useState } from 'react' // import React library and hooks useEffect, useState for component lifecycle and state management
import Navbar from '../shared/Navbar' // import Navbar component to display navigation bar
import { Label } from '../ui/label' // import Label component for form field labels
import { Input } from '../ui/input' // import Input component for input fields
import { RadioGroup } from '../ui/radio-group' // import RadioGroup component to group radio buttons
import { Button } from '../ui/button' // import Button component for clickable buttons
import { Link, useNavigate } from 'react-router-dom' // import Link for navigation links and useNavigate for programmatic routing
import axios from 'axios' // import axios library to make API requests
import { USER_API_END_POINT } from '@/utils/constant' // import constant containing user API base URL
import { toast } from 'sonner' // import toast library for user notifications
import { useDispatch, useSelector } from 'react-redux' // import hooks to access Redux store and dispatch actions
import { setLoading, setUser } from '@/redux/authSlice' // import Redux actions to modify loading and user states
import { Loader2 } from 'lucide-react' // import Loader2 icon to display loading animation

const Login = () => { // define a function component Login to handle user authentication
    const [input, setInput] = useState({ // initialize state variable input to store login form data
        email: "", // store user's email address as string
        password: "", // store user's password as string
        role: "", // store user's selected role (student or recruiter)
    })
    
    const { loading, user } = useSelector( // destructure loading and user from Redux store using useSelector hook
        store => store.auth // access auth slice from the Redux store to retrieve authentication state
    )
    const navigate = useNavigate() // initialize navigate function for redirection after login
    const dispatch = useDispatch() // initialize dispatch function to send actions to Redux store

    const changeEventHandler = (e) => { // define a function changeEventHandler to handle input changes
        setInput({ ...input, [e.target.name]: e.target.value }) // spread previous input state and update field using event target's name and value
    }

    const submitHandler = async (e) => { // define an asynchronous function submitHandler to handle form submission
        e.preventDefault() // prevent default form submission reload behavior
        
        try { // start try block to safely execute login request
            dispatch( // dispatch Redux action to set loading state before API call
                setLoading(true) // set loading to true to trigger loader
            )
            
            const res = await axios.post( // send POST request using axios to login endpoint
                `${USER_API_END_POINT}/login`, // construct URL for login endpoint
                input, // send input state as request body containing email, password, and role
                {
                    headers: { "Content-Type": "application/json" }, // set header to specify JSON payload
                    withCredentials: true // include credentials to maintain session cookies
                }
            )
            
            if (res.data.success) { // check if login response was successful
                dispatch( // dispatch Redux action to update user data in store
                    setUser(res.data.user) // set user state with data returned from backend response
                )
                navigate("/") // navigate to homepage after successful login
                toast.success(res.data.message) // show success toast notification with response message
            }
        } catch (error) { // catch any errors that occur during API request
            console.log(error) // log the error to console for debugging
            toast.error(error.response.data.message) // display error message returned from backend using toast
        } finally { // finally block to execute after try/catch completion
            dispatch( // dispatch Redux action again to stop loading spinner
                setLoading(false) // set loading back to false
            )
        }
    }
    
    useEffect(() => { // useEffect hook to handle redirection if user already logged in
        if (user) { // check if user exists in Redux store
            navigate("/") // redirect to homepage if user is already authenticated
        }
    }, []) // empty dependency array to run effect only once when component mounts

    return ( // return JSX structure to render login page
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form 
                    onSubmit={submitHandler} // attach submitHandler to handle login form submission
                    className='w-1/2 border border-gray-200 rounded-md p-4 my-10'
                >
                    <h1 className='font-bold text-xl mb-5'>Login</h1>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler} // attach changeEventHandler to update email field in state
                            placeholder="patel@gmail.com"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler} // attach changeEventHandler to update password field in state
                            placeholder="patel@gmail.com"
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler} // attach changeEventHandler to set role to student when selected
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r1">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler} // attach changeEventHandler to set role to recruiter when selected
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    {
                        loading // check if loading is true to show loader while login request is processing
                        ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> 
                        : <Button type="submit" className="w-full my-4">Login</Button>
                    }
                    <span className='text-sm'>Don't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Login
