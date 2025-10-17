import React, { useRef, useState } from 'react' // import React to use JSX and useRef/useState hooks for managing component state and DOM reference
import { useDispatch, useSelector } from 'react-redux' // import Redux hooks useDispatch for dispatching actions and useSelector for accessing Redux store state
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'; // import avatar components for displaying user profile picture
import { Button } from './ui/button'; // import button component for clickable UI actions
import { Textarea } from './ui/textarea'; // import textarea component for user bio input
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'; // import select components for dropdown gender selection
import axios from 'axios'; // import axios for making HTTP requests
import { Loader2 } from 'lucide-react'; // import Loader2 icon for showing loading spinner
import { useNavigate } from 'react-router-dom'; // import useNavigate hook to programmatically navigate between routes
import { toast } from 'sonner'; // import toast for showing success or error notifications
import { setAuthUser } from '@/redux/authSlice'; // import Redux action creator setAuthUser to update authenticated user data in store

const EditProfile = () => { // define a function component EditProfile to handle user profile editing logic
    const imageRef = useRef(); // create a mutable ref object imageRef to directly access file input element
    
    const { user } = useSelector(store => store.auth); // access user object from Redux store's auth slice using useSelector callback argument store
    
    const [loading, setLoading] = useState(false); // define a state variable loading initialized as false to track loading status
    
    const [input, setInput] = useState({ // define a state variable input initialized with user details to manage form data
        profilePhoto: user?.profilePicture, // set default profile photo from user's existing profile picture
        bio: user?.bio, // set default bio from user data
        gender: user?.gender // set default gender from user data
    });
    
    const navigate = useNavigate(); // initialize navigate function from useNavigate hook to redirect user after updating profile
    
    const dispatch = useDispatch(); // initialize dispatch function to dispatch Redux actions

    const fileChangeHandler = (e) => { // define a function fileChangeHandler to handle image file selection from input field with event object e
        const file = e.target.files?.[0]; // extract first file from event target files using optional chaining
        
        if (file) setInput({ ...input, profilePhoto: file }); // update input state by spreading current values and replacing profilePhoto with selected file
    }

    const selectChangeHandler = (value) => { // define a function selectChangeHandler to handle gender dropdown selection with argument value
        setInput({ ...input, gender: value }); // update gender in input state by spreading existing values and modifying gender key
    }

    const editProfileHandler = async () => { // define an async function editProfileHandler to send updated profile data to backend
        console.log(input); // log current input state for debugging
        
        const formData = new FormData(); // create a new FormData instance to send multipart/form-data request body
        
        formData.append("bio", input.bio); // append bio field to FormData with key "bio" and value input.bio
        
        formData.append("gender", input.gender); // append gender field to FormData with key "gender" and value input.gender
        
        if (input.profilePhoto) { // check if a profile photo file exists before appending
            formData.append("profilePhoto", input.profilePhoto); // append profilePhoto file to FormData with key "profilePhoto"
        }
        
        try {
            setLoading(true); // set loading state true to show loader during API call
            
            const res = await axios.post( // send a POST request using axios and store response in res
                'http://localhost:8080/api/v1/user/profile/edit', // first argument: API endpoint for profile edit
                formData, // second argument: formData containing bio, gender, and optional photo
                { // third argument: configuration object for axios request
                    headers: { // set headers property to define request content type
                        'Content-Type': 'multipart/form-data' // specify content type for file upload
                    },
                    withCredentials: true // include credentials like cookies with the request
                }
            );
            
            if (res.data.success) { // check if API response indicates successful profile update
                const updatedUserData = { // create updatedUserData object to store updated user info
                    ...user, // spread existing user properties
                    bio: res.data.user?.bio, // update bio from response data
                    profilePicture: res.data.user?.profilePicture, // update profile picture from response data
                    gender: res.data.user.gender // update gender from response data
                };
                
                dispatch(setAuthUser(updatedUserData)); // dispatch setAuthUser action with updated user data to update Redux store
                
                navigate(`/profile/${user?._id}`); // navigate user to their profile page using navigate function and user id
                
                toast.success(res.data.message); // show success toast notification using message from response data
            }
        } catch (error) {
            console.log(error); // log error to console for debugging
            toast.error(error.response.data.messasge); // show error toast using message from response
        } finally {
            setLoading(false); // reset loading state to false after request completes (success or failure)
        }
    }
    
    return (
        <div className='flex max-w-2xl mx-auto pl-10'>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>
                <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>
                    <div className='flex items-center gap-3'>
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} alt="post_image" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-bold text-sm'>{user?.username}</h1>
                            <span className='text-gray-600'>{user?.bio || 'Bio here...'}</span>
                        </div>
                    </div>
                    <input ref={imageRef} onChange={fileChangeHandler} type='file' className='hidden' /> {/* handle file selection logic */}
                    <Button onClick={() => imageRef?.current.click()} className='bg-[#0095F6] h-8 hover:bg-[#318bc7]'>Change photo</Button> {/* trigger hidden file input click */}
                </div>
                <div>
                    <h1 className='font-bold text-xl mb-2'>Bio</h1>
                    <Textarea value={input.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} name='bio' className="focus-visible:ring-transparent" /> {/* update bio input in state */}
                </div>
                <div>
                    <h1 className='font-bold mb-2'>Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler}> {/* handle gender selection */}
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex justify-end'>
                    {
                        loading ? ( // conditionally render loader button when loading state is true
                            <Button className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> {/* show spinning loader icon */}
                                Please wait
                            </Button>
                        ) : ( // otherwise render submit button
                            <Button onClick={editProfileHandler} className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>Submit</Button> // call editProfileHandler on click
                        )
                    }
                </div>
            </section>
        </div>
    )
}

export default EditProfile // export EditProfile component as default export
