import React, { useEffect, useState } from 'react' // import React library and hooks useEffect for lifecycle management and useState for component state handling
import Navbar from '../shared/Navbar' // import Navbar component to render the top navigation bar
import { Label } from '../ui/label' // import Label component to display form field labels
import { Input } from '../ui/input' // import Input component to capture user input values
import { RadioGroup } from '../ui/radio-group' // import RadioGroup component to group radio buttons logically
import { Button } from '../ui/button' // import Button component for user interactions
import { Link, useNavigate } from 'react-router-dom' // import Link for route navigation and useNavigate hook for programmatic redirects
import axios from 'axios' // import axios library to perform API requests
import { USER_API_END_POINT } from '@/utils/constant' // import API endpoint constant for backend user routes
import { toast } from 'sonner' // import toast library to display notifications to the user
import { useDispatch, useSelector } from 'react-redux' // import Redux hooks to access global state and dispatch actions
import { setLoading, setUser } from '@/redux/authSlice' // import Redux actions to update loading and user states in store
import { Loader2 } from 'lucide-react' // import Loader2 icon component to visually indicate loading state

const Login = () => { // define a functional component named 'Login' to handle user authentication
    const [input, setInput] = useState({ // initialize a state object named input using useState to store login form data
        email: "", // define key to store user's email as string
        password: "", // define key to store user's password as string
        role: "", // define key to store user's selected role as string
    }) 

    const { loading, user } = useSelector( // extract loading and user values from Redux store using useSelector hook
        store => store.auth // access auth slice from Redux store to retrieve authentication and loading state
    ) 
    const navigate = useNavigate() // initialize navigate function to programmatically redirect between routes
    const dispatch = useDispatch() // initialize dispatch function to send actions to Redux store

    const changeEventHandler = (e) => { // define a function changeEventHandler to update state when input fields change
        setInput({ ...input, [e.target.name]: e.target.value }) // spread previous state and modify the field corresponding to the changed input element
    } 

    const submitHandler = async (e) => { // define an asynchronous function submitHandler to process login form submission
        e.preventDefault() // prevent default form submission behavior to avoid page reload
        try { // start try block to attempt API call safely
            dispatch( // dispatch Redux action to toggle loading state before making API request
                setLoading(true) // set loading value to true in Redux store to trigger loading UI
            ) 
            const res = await axios.post( // make asynchronous POST request using axios to login endpoint
                `${USER_API_END_POINT}/login`, // specify complete backend URL by appending login route to base endpoint
                input, // send current state data containing email, password, and role as request body
                { 
                    headers: { "Content-Type": "application/json" }, // set request headers to specify JSON format
                    withCredentials: true // include cookies in request for authentication session management
                }
            ) 
            if (res.data.success) { // check API response to verify successful login
                dispatch( // dispatch Redux action to update authenticated user data in store
                    setUser(res.data.user) // store user information returned from backend in Redux store
                ) 
                navigate("/") // redirect authenticated user to homepage
                toast.success(res.data.message) // display success notification with server response message
            } 
        } catch (error) { // handle errors thrown during API request if any
            console.log(error) // log error details in console for debugging
            toast.error(error.response.data.message) // display error notification with backend-provided message
        } finally { // execute cleanup operations regardless of success or failure
            dispatch( // dispatch Redux action again to reset loading indicator
                setLoading(false) // set loading state back to false to stop showing loader
            ) 
        } 
    } 

    useEffect(() => { // useEffect hook to perform redirection after component mount
        if (user) { // check if authenticated user data already exists in Redux store
            navigate("/") // redirect user to homepage if already logged in
        } 
    }, []) // pass empty dependency array to ensure effect runs only once when component mounts

    return ( // return JSX to render login page
        <div>
            <Navbar /> 
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form 
                    onSubmit={submitHandler} // attach submitHandler to handle form submission event
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
                                    checked={input.role === 'student'} // compare input role with string 'student' to check if selected
                                    onChange={changeEventHandler} // attach changeEventHandler to set role value to student
                                    className="cursor-pointer" 
                                /> 
                                <Label htmlFor="r1">Student</Label> 
                            </div> 
                            <div className="flex items-center space-x-2">
                                <Input 
                                    type="radio" 
                                    name="role" 
                                    value="recruiter" 
                                    checked={input.role === 'recruiter'} // compare input role with string 'recruiter' to check if selected
                                    onChange={changeEventHandler} // attach changeEventHandler to set role value to recruiter
                                    className="cursor-pointer" 
                                /> 
                                <Label htmlFor="r2">Recruiter</Label> 
                            </div> 
                        </RadioGroup> 
                    </div> 
                    {
                        loading // evaluate loading state to determine button content
                        ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> 
                        : <Button type="submit" className="w-full my-4">Login</Button> 
                    } 
                    <span className='text-sm'>Don't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span> 
                </form> 
            </div> 
        </div> 
    ) 
} 

export default Login // export Login component as default to make it available for import in other files