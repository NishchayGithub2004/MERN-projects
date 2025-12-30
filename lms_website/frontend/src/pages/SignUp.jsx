import React, { useState } from 'react' // import React and useState hook to build component and manage local state
import logo from '../assets/logo.jpg' // import logo image asset for branding display
import google from '../assets/google.jpg' // import google image asset for Google signup button
import axios from 'axios' // import axios to make HTTP requests to backend APIs
import { serverUrl } from '../App' // import serverUrl constant to construct backend API endpoints
import { MdOutlineRemoveRedEye } from "react-icons/md"; // import outlined eye icon to indicate hidden password state
import { MdRemoveRedEye } from "react-icons/md"; // import filled eye icon to indicate visible password state
import { useNavigate } from 'react-router-dom' // import hook to programmatically navigate between routes
import { signInWithPopup } from 'firebase/auth' // import Firebase function to authenticate users using popup providers
import { auth, provider } from '../../utils/Firebase' // import configured Firebase auth instance and Google provider
import { ClipLoader } from 'react-spinners' // import spinner component to show loading state during async actions
import { toast } from 'react-toastify' // import toast utility to show success and error notifications
import { useDispatch } from 'react-redux' // import Redux hook to dispatch actions to global store
import { setUserData } from '../redux/userSlice' // import Redux action to store authenticated user information

function SignUp() { // define a functional component named 'SignUp' to handle user registration logic and UI
    // define state variables and functions to update them for user's name, email, password, role, password visibility and loading state
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("student")
    let [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const navigate = useNavigate() // initialize navigation function for redirecting after signup
    
    let dispatch = useDispatch() // initialize Redux dispatch function to update global user state

    const handleSignUp = async () => { // define a function to register a user using email and password
        setLoading(true) // enable loading indicator before starting signup request
        
        try {
            const result = await axios.post(serverUrl + "/api/auth/signup", { name, email, password, role }, { withCredentials: true }) // send signup request with user data and cookies enabled
            dispatch(setUserData(result.data)) // store newly registered user data in Redux state
            navigate("/") // redirect user to home page after successful signup
            toast.success("SignUp Successfully") // display success notification to the user
            setLoading(false) // disable loading indicator after successful operation
        }

        catch (error) {
            console.log(error) // log error details for debugging purposes
            setLoading(false) // disable loading indicator when signup fails
            toast.error(error.response.data.message) // display error message returned from backend
        }
    }

    const googleSignUp = async () => { // define a function to register or login user using Google OAuth
        try {
            const response = await signInWithPopup(auth, provider) // trigger Google sign-in popup using Firebase authentication
            console.log(response) // log Firebase response for debugging or inspection
            
            let user = response.user // extract authenticated user object from Firebase response
            let name = user.displayName; // store user's display name received from Google
            let email = user.email // store user's email received from Google

            const result = await axios.post(serverUrl + "/api/auth/googlesignup", { name, email, role } , { withCredentials: true }) // send Google user data to backend for signup or login
            
            dispatch(setUserData(result.data)) // store authenticated Google user data in Redux state
            navigate("/") // redirect user to home page after successful Google signup
            toast.success("SignUp Successfully") // display success notification to the user
        } catch (error) {
            console.log(error) // log error details for debugging purposes
            toast.error(error.response.data.message) // display error message returned from backend
        }
    }

    return ( // return JSX to render the signup page UI
        <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
            <form
                className='w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex'
                onSubmit={(e) => e.preventDefault()} // prevent default form submission to control signup via custom handler
            >
                <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3 '>
                    <div>
                        <h1 className='font-semibold text-[black] text-2xl'>Let's get Started</h1>
                        <h2 className='text-[#999797] text-[18px]'>Create your account</h2>
                    </div>
                    
                    <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
                        <label htmlFor="name" className='font-semibold'>Name</label>
                        <input
                            id='name'
                            type="text"
                            className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]'
                            placeholder='Your name'
                            onChange={(e) => setName(e.target.value)} // update name state based on user input
                            value={name} // bind input value to name state to keep it controlled
                        />
                    </div>
                    
                    <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
                        <label htmlFor="email" className='font-semibold'>Email</label>
                        <input
                            id='email'
                            type="text"
                            className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]'
                            placeholder='Your email'
                            onChange={(e) => setEmail(e.target.value)} // update email state based on user input
                            value={email} // bind input value to email state to keep it controlled
                        />
                    </div>
                    
                    <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative'>
                        <label htmlFor="password" className='font-semibold'>Password</label>
                        <input
                            id='password'
                            type={show ? "text" : "password"} // switch input type based on password visibility state
                            className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]'
                            placeholder='***********'
                            onChange={(e) => setPassword(e.target.value)} // update password state based on user input
                            value={password} // bind input value to password state to keep it controlled
                        />
                        
                        {!show && // render hidden-eye icon when password is masked
                            <MdOutlineRemoveRedEye
                                className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]'
                                onClick={() => setShow(prev => !prev)} // toggle password visibility to show password
                            />
                        }
                        
                        {show && // render visible-eye icon when password is visible
                            <MdRemoveRedEye
                                className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]'
                                onClick={() => setShow(prev => !prev)} // toggle password visibility to hide password
                            />
                        }
                    </div>
                    
                    <div className='flex md:w-[50%] w-[70%] items-center justify-between'>
                        <span
                            className={`px-[10px] py-[5px] border-[1px] border-[#e7e6e6] rounded-2xl cursor-pointer ${role === 'student' ? "border-black" : "border-[#646464]"}`} // dynamically style based on selected role
                            onClick={() => setRole("student")} // set role state to student
                        >
                            Student
                        </span>
                        
                        <span
                            className={`px-[10px] py-[5px] border-[1px] border-[#e7e6e6] rounded-2xl cursor-pointer ${role === 'educator' ? "border-black" : "border-[#646464]"}`} // dynamically style based on selected role
                            onClick={() => setRole("educator")} // set role state to educator
                        >
                            Educator
                        </span>
                    </div>
                    
                    <button
                        className='w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]'
                        disabled={loading} // disable button while signup request is in progress
                        onClick={handleSignUp} // trigger signup logic on button click
                    >
                        {loading ? <ClipLoader size={30} color='white' /> : "Sign Up"} {/* render loader during signup otherwise show button text */}
                    </button>
    
                    <div className='w-[80%] flex items-center gap-2'>
                        <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
                        <div className='w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center '>Or continue with</div>
                        <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
                    </div>
                    
                    <div
                        className='w-[80%] h-[40px] border-1 border-[black] rounded-[5px] flex items-center justify-center'
                        onClick={googleSignUp} // initiate Google OAuth signup flow
                    >
                        <img src={google} alt="" className='w-[25px]' />
                        <span className='text-[18px] text-gray-500'>oogle</span>
                    </div>
                    
                    <div className='text-[#6f6f6f]'>
                        Already have an account?
                        <span
                            className='underline underline-offset-1 text-[black]'
                            onClick={() => navigate("/login")} // navigate user to login page
                        >
                            Login
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

export default SignUp