import React, { useEffect, useState } from 'react' // import react and hooks useState for state handling and useEffect for running side effects
import Navbar from '../shared/Navbar' // import navbar component to show navigation bar at the top
import { Label } from '../ui/label' // import label component to display input field labels
import { Input } from '../ui/input' // import input component to render text and file inputs
import { RadioGroup } from '../ui/radio-group' // import radiogroup to group multiple radio input options
import { Button } from '../ui/button' // import button component to display styled buttons
import { Link, useNavigate } from 'react-router-dom' // import link for navigation and useNavigate hook for page redirection
import axios from 'axios' // import axios library to send http requests
import { USER_API_END_POINT } from '@/utils/constant' // import api endpoint constant for user operations
import { toast } from 'sonner' // import toast utility to display success or error notifications
import { useDispatch, useSelector } from 'react-redux' // import redux hooks to read global state and dispatch actions
import { setLoading } from '@/redux/authSlice' // import redux action to update loading state
import { Loader2 } from 'lucide-react' // import loader2 icon to visually indicate loading state

const Signup = () => { // define functional component 'Signup' to render signup form
    const [input, setInput] = useState({ // initialize local state 'input' to store form field values
        fullname: "", // store user's full name
        email: "", // store user's email address
        phoneNumber: "", // store user's phone number
        password: "", // store user's password
        role: "", // store user's selected role
        file: "" // store uploaded profile image file
    })

    const { loading, user } = useSelector( // extract loading and user states from redux store
        store => store.auth // access auth slice to retrieve authentication-related state
    )
    const dispatch = useDispatch() // create dispatch function to send redux actions
    const navigate = useNavigate() // create navigate function to programmatically redirect user

    const changeEventHandler = (e) => { // define function to handle text input changes dynamically
        setInput({ ...input, [e.target.name]: e.target.value }) // spread previous input values and update changed field using event target name
    }

    const changeFileHandler = (e) => { // define function to handle file selection input
        setInput({ ...input, file: e.target.files?.[0] }) // update file key in input state with first selected file
    }

    const submitHandler = async (e) => { // define asynchronous function to handle form submission
        e.preventDefault() // prevent page reload on form submit
        const formData = new FormData() // create new formdata object to send form values in multipart format
        formData.append("fullname", input.fullname) // add fullname value to formdata
        formData.append("email", input.email) // add email value to formdata
        formData.append("phoneNumber", input.phoneNumber) // add phone number value to formdata
        formData.append("password", input.password) // add password value to formdata
        formData.append("role", input.role) // add role value to formdata
        if (input.file) { // check if file is present before appending
            formData.append("file", input.file) // add file to formdata for upload
        }
        try { // start try block to handle api request safely
            dispatch(setLoading(true)) // set loading to true before making api call
            const res = await axios.post( // send post request to backend register endpoint
                `${USER_API_END_POINT}/register`, // construct full url using endpoint constant
                formData, // send formdata containing user inputs
                { 
                    headers: { 'Content-Type': "multipart/form-data" }, // specify multipart content type for file uploads
                    withCredentials: true // include credentials for cookie-based authentication
                }
            )
            if (res.data.success) { // check if registration was successful
                navigate("/login") // redirect user to login page
                toast.success(res.data.message) // display success message from server
            }
        } catch (error) { // handle any errors during api request
            console.log(error) // log error for debugging purposes
            toast.error(error.response.data.message) // show error notification from backend
        } finally { // execute cleanup actions regardless of outcome
            dispatch(setLoading(false)) // set loading to false after api request finishes
        }
    }

    useEffect(() => { // define effect to check authentication status when component mounts
        if (user) { // check if user already logged in
            navigate("/") // redirect logged-in user to homepage
        }
    }, []) // run only once on component mount

    return ( // return jsx layout for signup form ui
        <div>
            <Navbar /> // render navbar at top of page
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form 
                    onSubmit={submitHandler} // attach form submit handler
                    className='w-1/2 border border-gray-200 rounded-md p-4 my-10'
                >
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler} // call changeEventHandler to update fullname state
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler} // call changeEventHandler to update email state
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler} // call changeEventHandler to update phone number state
                            placeholder="Enter your contact number"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler} // call changeEventHandler to update password state
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
                                    checked={input.role === 'student'} // check the box if user is a student
                                    onChange={changeEventHandler} // call changeEventHandler to set role as student
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r1">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'} // check the box of user is a recruiter
                                    onChange={changeEventHandler} // call changeEventHandler to set role as recruiter
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        <div className='flex items-center gap-2'>
                            <Label>Profile</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler} // call changeFileHandler to store selected profile image
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                    {
                        loading // check if loading state is true
                        ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> // show loading spinner while submitting
                        : <Button type="submit" className="w-full my-4">Signup</Button> // show signup button when not loading
                    }
                    <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span> // show link to login page for existing users
                </form>
            </div>
        </div>
    )
}

export default Signup // export signup component as default to use in other parts of app