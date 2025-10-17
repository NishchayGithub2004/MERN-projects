import React, { useEffect, useState } from 'react' // import React with useState and useEffect hooks for managing state and side effects
import { Input } from './ui/input' // import Input component for user input fields
import { Button } from './ui/button' // import Button component for form submission
import axios from 'axios' // import axios for making HTTP requests to the backend
import { toast } from 'sonner' // import toast from sonner library to show success or error notifications
import { Link, useNavigate } from 'react-router-dom' // import Link for navigation and useNavigate to programmatically redirect
import { Loader2 } from 'lucide-react' // import Loader2 icon to show a loading spinner during API calls
import { useSelector } from 'react-redux' // import useSelector hook to access Redux store state

const Signup = () => {
    const [input, setInput] = useState({ // define local state 'input' to store user registration data
        username: "", // store entered username
        email: "", // store entered email
        password: "" // store entered password
    })

    const [loading, setLoading] = useState(false) // define 'loading' state to track API request progress

    const { user } = useSelector(store => store.auth) // extract 'user' from Redux auth slice to check if someone is already logged in

    const navigate = useNavigate() // initialize navigate function to redirect users between routes

    const changeEventHandler = (e) => { // handle input field changes dynamically
        setInput({ ...input, [e.target.name]: e.target.value }) // update specific input field based on its name attribute and current value
    }

    const signupHandler = async (e) => { // handle signup form submission asynchronously
        e.preventDefault() // prevent page reload on form submission

        try {
            setLoading(true) // set loading to true before sending request

            const res = await axios.post( // send POST request to backend signup endpoint
                'http://localhost:8080/api/v1/user/register', // API URL for user registration
                input, // request body containing username, email, and password
                {
                    headers: { 'Content-Type': 'application/json' }, // specify JSON content type
                    withCredentials: true // include cookies for authentication if needed
                }
            )

            if (res.data.success) { // check if signup was successful
                navigate("/login") // redirect user to login page
                toast.success(res.data.message) // show success notification with server message
                setInput({ username: "", email: "", password: "" }) // reset form inputs to empty strings
            }
        } catch (error) {
            console.log(error) // log error for debugging
            toast.error(error.response.data.message) // display error message from server using toast
        } finally {
            setLoading(false) // stop loader after request completion (success or failure)
        }
    }

    useEffect(() => { // check authentication state on component mount
        if (user) { // if user is already logged in
            navigate("/") // redirect them to the homepage
        }
    }, []) // run only once when the component mounts

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>LOGO</h1>
                    <p className='text-sm text-center'>Signup to see photos & videos from your friends</p>
                </div>
                <div>
                    <span className='font-medium'>Username</span>
                    <Input
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={changeEventHandler} // update username field in state on input change
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler} // update email field in state on input change
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler} // update password field in state on input change
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                {
                    loading ? ( // check if API call is in progress
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> {/* show spinning loader during signup */}
                            Please wait
                        </Button>
                    ) : (
                        <Button type='submit'>Signup</Button> // show signup button when not loading
                    )
                }
                <span className='text-center'>
                    Already have an account? <Link to="/login" className='text-blue-600'>Login</Link> {/* navigate to login page */}
                </span>
            </form>
        </div>
    )
}

export default Signup