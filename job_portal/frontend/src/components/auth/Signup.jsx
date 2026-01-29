import React, { useEffect, useState } from 'react' // from React library, import 'useEffect' hook to perform side effects and 'useState' hook to create and manage state variables
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom' // from 'react-router-dom' library, import 'Link' component to create links to different routes and 'useNavigate' hook to actually navigate to different routes
import axios from 'axios' // import 'axios' library to make HTTP requests to the backend
import { USER_API_END_POINT } from '@/utils/constant' // import URL of the backend to send requests to
import { toast } from 'sonner' // import 'toast' to render pop-up messages
import { useDispatch, useSelector } from 'react-redux'; // import 'useDispatch' hook to dispatch actions to redux store and 'useSelector' hook to select state from the Redux store
import { setLoading } from '@/redux/authSlice' // import 'setLoading' function from 'authSlice' to update values of authentication related states
import { Loader2 } from 'lucide-react'

const Signup = () => { // create a functional component called 'Signup' to render signup page
    const [input, setInput] = useState({ fullname: "", email: "", phoneNumber: "", password: "", role: "", file: "" })
    // create a state variable called 'input' which contains an object with 3 properties: full name, email, phone number, password, role (recruiter or job seeker), and file (image uploaded by user as profile picture)
    // initial values of all these properties is an empty string and a function called 'setInput' to change values of these properties

    const { loading, user } = useSelector(store => store.auth) // use 'useSelector' hook to access 'loading' and 'user' states from 'auth' part of redux store

    const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to navigate users to different routes

    const dispatch = useDispatch() // create an instace of 'useDispatch' hook to dispatch actions to redux store to update values of states

    const changeEventHandler = (e) => { // create a function called 'changeEventHandler' that takes an event object as argument
        setInput({ ...input, [e.target.name]: e.target.value }) // use 'setInput' function to copy values of unchanged login page
        // input fields using spread operator and change value of input field in which another value is given, this is all being
        // done in 'input' object to update input field details when user gives any other input to the input fields
    }

    const changeFileHandler = (e) => { // create a function called 'changeFileHandler' that takes an event object as argument
        setInput({ ...input, file: e.target.files?.[0] }) // use 'setInput' function to copy values of unchanged login page
        // input fields using spread operator and change value of 'file' input field in which another value is given, this is all being
        // done in 'input' object to update 'file' input field details when user gives any other input to the 'file' field
    }

    const submitHandler = async (e) => {
        e.preventDefault() // prevent default behavior of the form so that it submits after doing what we want to happen before form actually submits

        const formData = new FormData() // create an instance of 'FormData' object to fill form input fields as a JSON object to send to the backend

        // add form input field values into this instance (including user profile picture as file if given by user)

        formData.append("fullname", input.fullname)
        formData.append("email", input.email)
        formData.append("phoneNumber", input.phoneNumber)
        formData.append("password", input.password)
        formData.append("role", input.role)

        if (input.file) formData.append("file", input.file)

        try {
            dispatch(setLoading(true)) // set value of 'loading' state to true by dispatching it to 'setLoading' function of redux store

            const res = await axios.post( // make a POST request to the backend using 'axios' library
                `${USER_API_END_POINT}/register`, // this is the backend URL to make POST request to
                input, // this is the data to send to the backend URL, it contains the values filled in signup form fields as an object
                {
                    headers: { "Content-Type": "application/json" }, // the data is being sent in JSON form
                    withCredentials: true // send cookies to the backend along with the form fields data for authentication
                }
            )

            if (res.data.success) { // if data is sent to the backend successfully
                dispatch(setUser(res.data.user)) // dispatch the data sent by backend as response to 'user' state using 'setUser' function
                navigate("/login") // navigate user to login page
                toast.success(res.data.message) // whatever message the backend sent as response, show it as a pop-up message
            }
        } catch (error) { // if any error occurs while submitting the login form details
            console.log(error) // log the error to the console to know what error occured
            toast.error(error.response.data.message) // whatever error message the backend sent as response, show it as a pop-up message
        } finally {
            dispatch(setLoading(false)) // finally set value of 'loading' state to false by dispatching this value to 'setLoading' function
        }
    }

    // create a side-effect that runs only once (as soon as the login page renders), if user exists, navigate it to home page as it doesn't need to register
    
    useEffect(() => {
        if (user) {
            navigate("/")
        }
    }, [])

    return (
        <div>
            <Navbar />
            
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form
                    onSubmit={submitHandler} // submitting this form calls 'submitHandler' function
                    className='w-1/2 border border-gray-200 rounded-md p-4 my-10'
                >
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>

                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className='my-2'>
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="Enter your contact number"
                        />
                    </div>

                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className='flex items-center justify-between'>
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'} // by default check this option if user is job seeker
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label>Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'} // by default check this option if user is recruiter
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label>Recruiter</Label>
                            </div>
                        </RadioGroup>

                        <div className='flex items-center gap-2'>
                            <Label>Profile</Label>
                            <Input
                                accept="image/*" // this input field accepts images only
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>

                    {
                        loading // if value of 'loading' state is true, render a loading spinner with 'Please wait' text, otherwise render a button called 'Signup' clicking which submits the form
                            ? <Button className="w-full my-4">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </Button>
                            : <Button type="submit" className="w-full my-4">
                                Signup
                            </Button>
                    }

                    <span className='text-sm'>
                        Already have an account?
                        <Link to="/login" className='text-blue-600'>Login</Link> {/* render a link to Login page user can go to if it is already registered */}
                    </span>
                </form>
            </div>
        </div>
    )
}

export default Signup