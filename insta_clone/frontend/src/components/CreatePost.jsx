import React, { useRef, useState } from 'react' // import React for JSX support and useRef/useState hooks for referencing DOM elements and managing component state
import { Dialog, DialogContent, DialogHeader } from './ui/dialog' // import dialog components to create and display modal UI
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar' // import avatar components to show user's profile image and fallback text
import { Textarea } from './ui/textarea' // import textarea component for post caption input
import { Button } from './ui/button' // import reusable button component for user actions
import { readFileAsDataURL } from '@/lib/utils' // import utility function to convert file into base64 data URL for image preview
import { Loader2 } from 'lucide-react' // import loader icon from lucide-react to show loading spinner
import { toast } from 'sonner' // import toast notification library to show success or error messages
import axios from 'axios' // import axios library to perform HTTP requests
import { useDispatch, useSelector } from 'react-redux' // import Redux hooks to interact with store and dispatch actions
import { setPosts } from '@/redux/postSlice' // import Redux action to update posts state in the global store

const CreatePost = ({ open, setOpen }) => { // define a function component CreatePost with open (boolean) and setOpen (function) props to control dialog visibility
    const imageRef = useRef() // define imageRef reference to access hidden file input element programmatically
    
    const [file, setFile] = useState("") // define file state to store selected image file
    
    const [caption, setCaption] = useState("") // define caption state to store text entered by the user for post caption
    
    const [imagePreview, setImagePreview] = useState("") // define imagePreview state to store base64 representation of selected image for preview
    
    const [loading, setLoading] = useState(false) // define loading state to track API request progress and control loading UI
    
    const { user } = useSelector(store => store.auth) // extract user data from Redux auth slice using useSelector
    
    const { posts } = useSelector(store => store.post) // extract posts array from Redux post slice to update UI after post creation
    
    const dispatch = useDispatch() // create dispatch function to trigger Redux actions

    const fileChangeHandler = async (e) => { // define an async function fileChangeHandler to handle file input change event
        const file = e.target.files?.[0] // get the first selected file from file input using optional chaining
        
        if (file) { // check if a valid file is selected
            setFile(file) // update file state with selected file object
            const dataUrl = await readFileAsDataURL(file) // convert file into base64 data URL using helper function
            setImagePreview(dataUrl) // update imagePreview state to display image preview in UI
        }
    }

    const createPostHandler = async (e) => { // define async function createPostHandler to handle new post creation request
        const formData = new FormData() // create a new FormData object to send form data with image and caption
        
        formData.append("caption", caption) // append caption text to FormData under key "caption"
        
        if (imagePreview) formData.append("image", file) // conditionally append image file to FormData if preview exists
        
        try {
            setLoading(true) // set loading to true before making API request
            const res = await axios.post( // send POST request to create new post on server
                'http://localhost:8080/api/v1/post/addpost', // endpoint URL for adding new post
                formData, // send form data (caption and image)
                {
                    headers: { 'Content-Type': 'multipart/form-data' }, // set header type for file upload
                    withCredentials: true // include cookies for user authentication
                }
            )
            
            if (res.data.success) { // check if API response indicates successful post creation
                dispatch( // dispatch Redux action to update posts state in store
                    setPosts([res.data.post, ...posts]) // prepend newly created post to existing posts array
                )
                toast.success(res.data.message) // show success toast message from server response
                setOpen(false) // close the create post dialog after successful post creation
            }
        } catch (error) { // handle errors during API request
            toast.error(error.response.data.message) // show error toast with server-provided message
        } finally {
            setLoading(false) // reset loading state after request completion (success or failure)
        }
    }

    return ( // return JSX for CreatePost modal component
        <Dialog open={open}> {/* control dialog visibility with open prop */}
            <DialogContent onInteractOutside={() => setOpen(false)}> {/* close dialog when user clicks outside content */}
                <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
                <div className='flex gap-3 items-center'>
                    <Avatar>
                        <AvatarImage src={user?.profilePicture} alt="img" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className='font-semibold text-xs'>{user?.username}</h1>
                        <span className='text-gray-600 text-xs'>Bio here...</span>
                    </div>
                </div>
                <Textarea 
                    value={caption} // bind caption state to textarea for controlled input
                    onChange={(e) => setCaption(e.target.value)} // update caption state on input change
                    className="focus-visible:ring-transparent border-none" 
                    placeholder="Write a caption..." 
                />
                {
                    imagePreview && ( // conditionally render image preview if available
                        <div className='w-full h-64 flex items-center justify-center'>
                            <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
                        </div>
                    )
                }
                <input 
                    ref={imageRef} // attach input reference to trigger file picker programmatically
                    type='file' 
                    className='hidden' 
                    onChange={fileChangeHandler} // handle file selection and preview logic
                />
                <Button 
                    onClick={() => imageRef.current.click()} // programmatically trigger hidden file input on button click
                    className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]' 
                >
                    Select from computer
                </Button>
                {
                    imagePreview && ( // show post or loading button only if image is selected
                        loading ? ( // if loading is true, show loading spinner button
                            <Button>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> {/* show rotating loader icon */}
                                Please wait
                            </Button>
                        ) : ( // else show button to create post
                            <Button 
                                onClick={createPostHandler} // trigger createPostHandler to upload new post
                                type="submit" 
                                className="w-full"
                            >
                                Post
                            </Button>
                        )
                    )
                }
            </DialogContent>
        </Dialog>
    )
}

export default CreatePost
