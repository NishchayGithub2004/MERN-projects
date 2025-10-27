import React, { useEffect, useState } from 'react' // import React library and hooks useEffect, useState for state management and side effects
import Navbar from '../shared/Navbar' // import Navbar component to display the navigation bar at top
import { Label } from '../ui/label' // import Label component for input labeling
import { Input } from '../ui/input' // import Input component for input fields
import { RadioGroup } from '../ui/radio-group' // import RadioGroup for role selection inputs
import { Button } from '../ui/button' // import Button component for interactive buttons
import { Link, useNavigate } from 'react-router-dom' // import Link for navigation and useNavigate hook for programmatic redirection
import axios from 'axios' // import axios library to make API requests
import { USER_API_END_POINT } from '@/utils/constant' // import backend API endpoint constant
import { toast } from 'sonner' // import toast for showing user notifications
import { useDispatch, useSelector } from 'react-redux' // import Redux hooks to manage and access global state
import { setLoading } from '@/redux/authSlice' // import Redux action creator to toggle loading state
import { Loader2 } from 'lucide-react' // import Loader2 icon to show loading animation

const Signup = () => { // define a function component Signup to render user registration form
    const [input, setInput] = useState({ // initialize a state variable input with useState to store form field values
        fullname: "", // store full name value as a string
        email: "", // store email address as a string
        phoneNumber: "", // store phone number as a string
        password: "", // store password as a string
        role: "", // store user role as a string
        file: "" // store selected file object or empty string
    })
    
    const { loading, user } = useSelector( // destructure loading and user from Redux store using useSelector hook
        store => store.auth // access auth slice to get authentication and loading states
    )
    const dispatch = useDispatch() // initialize dispatch to send actions to Redux store
    const navigate = useNavigate() // initialize navigate to redirect user programmatically

    const changeEventHandler = (e) => { // define a function changeEventHandler to update text input state on change
        setInput({ ...input, [e.target.name]: e.target.value }) // spread previous state and update only the changed input field using event target name and value
    }

    const changeFileHandler = (e) => { // define a function changeFileHandler to handle file input changes
        setInput({ ...input, file: e.target.files?.[0] }) // spread existing input state and set file property to the first selected file
    }

    const submitHandler = async (e) => { // define an asynchronous function submitHandler to handle form submission
        e.preventDefault() // prevent default form reload behavior on submit
        
        const formData = new FormData() // create new FormData instance to send multipart form data to backend
        
        formData.append("fullname", input.fullname) // append fullname to formData
        formData.append("email", input.email) // append email to formData
        formData.append("phoneNumber", input.phoneNumber) // append phone number to formData
        formData.append("password", input.password) // append password to formData
        formData.append("role", input.role) // append role (student/recruiter) to formData
        
        if (input.file) { // check if file exists before appending
            formData.append("file", input.file) // append file to formData if present
        }

        try { // start try block to handle potential API errors
            dispatch( // dispatch Redux action to update loading state
                setLoading(true) // set loading to true to show loader while API call runs
            )
            const res = await axios.post( // send POST request using axios to register user
                `${USER_API_END_POINT}/register`, // construct URL using constant endpoint and register route
                formData, // send form data as body of request
                { 
                    headers: { 'Content-Type': "multipart/form-data" }, // set headers to indicate multipart form data
                    withCredentials: true // include credentials (cookies) for authentication context
                }
            )
            
            if (res.data.success) { // check response success property to confirm successful registration
                navigate("/login") // navigate to login page after successful signup
                toast.success(res.data.message) // show success toast with backend message
            }
        } catch (error) { // catch block to handle request errors
            console.log(error) // log error to console for debugging
            toast.error(error.response.data.message) // show error message from backend using toast notification
        } finally { // finally block to execute regardless of try/catch outcome
            dispatch( // dispatch Redux action again to update loading state
                setLoading(false) // set loading back to false to stop loader
            )
        }
    }

    useEffect(() => { // useEffect hook to run logic after component mounts
        if (user) { // check if user already exists in Redux store
            navigate("/") // redirect authenticated user to homepage
        }
    }, []) // run effect only once on mount since dependency array is empty

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form 
                    onSubmit={submitHandler} // attach submitHandler to handle form submit event
                    className='w-1/2 border border-gray-200 rounded-md p-4 my-10'
                >
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler} // attach changeEventHandler to update fullname in state
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler} // attach changeEventHandler to update email in state
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler} // attach changeEventHandler to update phone number in state
                            placeholder="Enter your contact number"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler} // attach changeEventHandler to update password in state
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
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler} // attach changeEventHandler to update role to student
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
                                    onChange={changeEventHandler} // attach changeEventHandler to update role to recruiter
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
                                onChange={changeFileHandler} // attach changeFileHandler to handle profile image upload
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                    {
                        loading // check if loading is true to show loader button while API request runs
                        ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> 
                        : <Button type="submit" className="w-full my-4">Signup</Button>
                    }
                    <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Signup
