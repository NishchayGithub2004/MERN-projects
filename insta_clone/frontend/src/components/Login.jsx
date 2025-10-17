import React, { useEffect, useState } from 'react' // import React and hooks useEffect/useState for managing side-effects and local state
import { Input } from './ui/input' // import Input component for email/password fields
import { Button } from './ui/button' // import Button component for clickable actions
import axios from 'axios'; // import axios to make HTTP requests
import { toast } from 'sonner'; // import toast for success/error notifications
import { Link, useNavigate } from 'react-router-dom'; // import Link for navigation and useNavigate for programmatic route changes
import { Loader2 } from 'lucide-react'; // import Loader2 icon for showing loading spinner
import { useDispatch, useSelector } from 'react-redux'; // import Redux hooks to dispatch actions and select store state
import { setAuthUser } from '@/redux/authSlice'; // import Redux action to update authenticated user in store

const Login = () => { // define a function component Login to handle user login logic
    const [input, setInput] = useState({ // define state input to store email and password values
        email: "", // initialize email as empty string
        password: "" // initialize password as empty string
    });

    const [loading, setLoading] = useState(false); // define loading state to track API call status
    
    const { user } = useSelector(store => store.auth); // select user object from auth slice of Redux store
    
    const navigate = useNavigate(); // initialize navigate function to programmatically change routes
    
    const dispatch = useDispatch(); // initialize dispatch function to dispatch Redux actions

    const changeEventHandler = (e) => { // define a function to handle input changes with event object e
        setInput({ ...input, [e.target.name]: e.target.value }); // update input state dynamically based on input field name
    }

    const signupHandler = async (e) => { // define an async function to handle form submission and login with event object e
        e.preventDefault(); // prevent default form submission behavior
        
        try {
            setLoading(true); // set loading state true while sending API request
            
            const res = await axios.post( // send POST request to login API and store response in res
                'http://localhost:8080/api/v1/user/login', // API endpoint for login
                input, // request body containing email and password
                { // axios configuration object
                    headers: { // set request headers
                        'Content-Type': 'application/json' // specify JSON content type
                    },
                    withCredentials: true // include cookies/credentials in request
                }
            );
            
            if (res.data.success) { // check if login was successful
                dispatch(setAuthUser(res.data.user)); // update authenticated user in Redux store
                navigate("/"); // navigate to homepage after successful login
                toast.success(res.data.message); // show success toast with message from API
                setInput({ // reset input state after successful login
                    email: "", // clear email field
                    password: "" // clear password field
                });
            }
        } catch (error) {
            console.log(error); // log error to console for debugging
            toast.error(error.response.data.message); // show error toast with message from API
        } finally {
            setLoading(false); // reset loading state after API call completes
        }
    }

    useEffect(() => { // use useEffect to check if user is already logged in
        if (user) { // if user exists in Redux store
            navigate("/"); // navigate to homepage
        }
    }, []) // run effect once on component mount

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'> {/* handle form submit with signupHandler */}
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>LOGO</h1>
                    <p className='text-sm text-center'>Login to see photos & videos from your friends</p>
                </div>
                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type="email" // input type email
                        name="email" // name attribute to update input state dynamically
                        value={input.email} // bind input value to state
                        onChange={changeEventHandler} // call changeEventHandler on input change
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password" // input type password
                        name="password" // name attribute to update input state dynamically
                        value={input.password} // bind input value to state
                        onChange={changeEventHandler} // call changeEventHandler on input change
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                {
                    loading ? ( // conditionally render loading button if loading state is true
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> {/* show spinning loader icon */}
                            Please wait
                        </Button>
                    ) : ( // otherwise render normal login button
                        <Button type='submit'>Login</Button> // submit button triggers signupHandler
                    )
                }
                <span className='text-center'>Dosent have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span> {/* link to navigate to signup page */}
            </form>
        </div>
    )
}

export default Login // export Login component as default export
