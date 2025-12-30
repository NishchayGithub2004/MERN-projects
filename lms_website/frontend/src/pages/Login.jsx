import React, { useState } from 'react' // import React and useState hook to create and manage component state
import logo from '../assets/logo.jpg' // import logo image asset to display branding in the login UI
import google from '../assets/google.jpg' // import google image asset to visually represent Google login option
import axios from 'axios' // import axios to perform HTTP requests to the backend API
import { serverUrl } from '../App' // import serverUrl constant to build backend API endpoint URLs
import { MdOutlineRemoveRedEye } from "react-icons/md"; // import outline eye icon to represent hidden password state
import { MdRemoveRedEye } from "react-icons/md"; // import filled eye icon to represent visible password state
import { useNavigate } from 'react-router-dom' // import useNavigate hook to programmatically navigate between routes
import { signInWithPopup } from 'firebase/auth' // import Firebase function to authenticate users via popup-based providers
import { auth, provider } from '../../utils/Firebase' // import configured Firebase auth instance and Google auth provider
import { toast } from 'react-toastify' // import toast utility to show success and error notifications
import { ClipLoader } from 'react-spinners' // import loading spinner component to indicate async operations
import { useDispatch } from 'react-redux' // import useDispatch hook to dispatch actions to Redux store
import { setUserData } from '../redux/userSlice' // import Redux action to store authenticated user data

function Login() { // define a functional component named 'Login' to handle user authentication UI and logic
    const [email, setEmail] = useState("") // store and update the user's email input value
    const [password, setPassword] = useState("") // store and update the user's password input value
    let [show, setShow] = useState(false) // store and toggle password visibility state
    const [loading, setLoading] = useState(false) // store and control loading state during async login operations
    
    const navigate = useNavigate() // initialize navigation function to redirect users after successful login
    
    let dispatch = useDispatch() // initialize Redux dispatch function to update global user state

    const handleLogin = async () => { // define a function to authenticate user using email and password credentials
        setLoading(true) // enable loading indicator before starting login request
        
        try {
            const result = await axios.post(serverUrl + "/api/auth/login", { email, password }, { withCredentials: true }) // send login request to backend with user credentials and cookies enabled
            dispatch(setUserData(result.data)) // store authenticated user data in Redux state
            navigate("/") // redirect user to home page after successful login
            setLoading(false) // disable loading indicator after successful operation
            toast.success("Login Successfully") // show success notification to the user
        } catch (error) {
            console.log(error) // log error details for debugging purposes
            setLoading(false) // disable loading indicator when login fails
            toast.error(error.response.data.message) // display error message received from backend
        }
    }

    const googleLogin = async () => { // define a function to authenticate user using Google OAuth via Firebase
        try {
            const response = await signInWithPopup(auth, provider) // trigger Google sign-in popup using Firebase authentication

            let user = response.user // extract authenticated user object from Firebase response
            let name = user.displayName; // store user's display name received from Google
            let email = user.email // store user's email received from Google
            let role = "" // initialize role field to be assigned or handled by backend

            const result = await axios.post(serverUrl + "/api/auth/googlesignup", { name, email, role } , { withCredentials: true }) // send Google user data to backend for login or signup
            
            dispatch(setUserData(result.data)) // store authenticated Google user data in Redux state
            navigate("/") // redirect user to home page after successful Google login
            toast.success("Login Successfully") // show success notification to the user
        } catch (error) {
            console.log(error) // log error details for debugging purposes
            toast.error(error.response.data.message) // display error message received from backend
        }
    }

    return ( // return JSX to render the login page UI
        <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
            <form
                className='w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex'
                onSubmit={(e) => e.preventDefault()} // prevent default form submission to handle login via custom logic
            >
                <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-4 '>
                    <div>
                        <h1 className='font-semibold text-[black] text-2xl'>Welcome back</h1>
                        <h2 className='text-[#999797] text-[18px]'>Login to your account</h2>
                    </div>
                    
                    <div className='flex flex-col gap-1 w-[85%] items-start justify-center px-3'>
                        <label htmlFor="email" className='font-semibold'>Email</label>
                        <input
                            id='email'
                            type="text"
                            className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]'
                            placeholder='Your email'
                            onChange={(e) => setEmail(e.target.value)} // update email state as user types into email input
                            value={email} // bind input value to email state to keep it controlled
                        />
                    </div>
    
                    <div className='flex flex-col gap-1 w-[85%] items-start justify-center px-3 relative'>
                        <label htmlFor="password" className='font-semibold'>Password</label>
                        
                        <input
                            id='password'
                            type={show ? "text" : "password"} // toggle input type based on password visibility state
                            className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]'
                            placeholder='***********'
                            onChange={(e) => setPassword(e.target.value)} // update password state as user types into password input
                            value={password} // bind input value to password state to keep it controlled
                        />
                        
                        {!show && // conditionally render hidden-eye icon when password is masked
                            <MdOutlineRemoveRedEye
                                className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]'
                                onClick={() => setShow(prev => !prev)} // toggle password visibility to show password text
                            />
                        }
                        
                        {show && // conditionally render visible-eye icon when password is shown
                            <MdRemoveRedEye
                                className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]'
                                onClick={() => setShow(prev => !prev)} // toggle password visibility to hide password text
                            />
                        }
                    </div>
    
                    <button
                        className='w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]'
                        disabled={loading} // disable login button while login request is in progress
                        onClick={handleLogin} // trigger email-password login logic on button click
                    >
                        {loading ? <ClipLoader size={30} color='white' /> : "Login"} {/* show loader during login request otherwise show login text */}
                    </button>
                    
                    <span
                        className='text-[13px] cursor-pointer text-[#585757]'
                        onClick={() => navigate("/forgotpassword")} // navigate user to forgot password page
                    >
                        Forget your password?
                    </span>
    
                    <div className='w-[80%] flex items-center gap-2'>
                        <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
                        <div className='w-[50%] text-[15px] text-[#999797] flex items-center justify-center '>Or continue with</div>
                        <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
                    </div>
    
                    <div
                        className='w-[80%] h-[40px] border-1 border-[#d3d2d2] rounded-[5px] flex items-center justify-center '
                        onClick={googleLogin} // initiate Google OAuth login flow when clicked
                    >
                        <img src={google} alt="" className='w-[25px]' />
                        <span className='text-[18px] text-gray-500'>oogle</span>
                    </div>
                    
                    <div className='text-[#6f6f6f]'>
                        Don't have an account?
                        <span
                            className='underline underline-offset-1 text-[black]'
                            onClick={() => navigate("/signup")} // navigate user to signup page
                        >
                            Sign up
                        </span>
                    </div>
                </div>
    
                <div className='w-[50%] h-[100%] rounded-r-2xl bg-[black] md:flex items-center justify-center flex-col hidden'>
                    <img src={logo} className='w-30 shadow-2xl' alt="" />
                    <span className='text-[white] text-2xl'>VIRTUAL COURSES</span>
                </div>
            </form>
        </div>
    )    
}

export default Login