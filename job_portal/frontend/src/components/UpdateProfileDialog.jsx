import React, { useState } from 'react' // import React library to define components and useState hook to manage local state
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog' // import dialog components to render modal interface for updating user profile
import { Label } from './ui/label' // import label component for describing input fields in the form
import { Input } from './ui/input' // import input component for text or file entry fields in the form
import { Button } from './ui/button' // import button component for user-triggered actions like submit
import { Loader2 } from 'lucide-react' // import loader2 icon to visually indicate loading state
import { useDispatch, useSelector } from 'react-redux' // import redux hooks to access and modify global application state
import axios from 'axios' // import axios library to handle http requests for data submission
import { USER_API_END_POINT } from '@/utils/constant' // import constant storing base api endpoint for user-related requests
import { setUser } from '@/redux/authSlice' // import redux action creator to update user details in global store
import { toast } from 'sonner' // import toast utility to display temporary feedback messages to the user

const UpdateProfileDialog = ({ open, setOpen }) => { // define a functional component named updateprofiledialog that receives open state and setopen function as props to control modal visibility
    const [loading, setLoading] = useState(false) // initialize local state variable loading to track whether api request is in progress

    const { user } = useSelector(store => store.auth) // extract user object from redux auth slice to access current user's information

    const [input, setInput] = useState({ // initialize local state object input to store editable user profile details
        fullname: user?.fullname || "", // assign user's fullname or default to empty string if not defined
        email: user?.email || "", // assign user's email or default to empty string if not defined
        phoneNumber: user?.phoneNumber || "", // assign user's phone number or default to empty string if not defined
        bio: user?.profile?.bio || "", // assign user's bio from nested profile or default to empty string if not defined
        skills: user?.profile?.skills?.map(skill => skill) || "", // copy skills array if it exists or default to empty string otherwise
        file: user?.profile?.resume || "" // assign user's existing resume file or default to empty string if not defined
    })

    const dispatch = useDispatch() // obtain redux dispatch function to trigger state updates globally

    const changeEventHandler = (e) => { // define event handler to manage text input changes
        setInput({ ...input, [e.target.name]: e.target.value }) // update corresponding field in input state based on input name and current value
    }

    const fileChangeHandler = (e) => { // define event handler to manage file selection input
        const file = e.target.files?.[0] // extract the first selected file from file input
        setInput({ ...input, file }) // update input state by assigning selected file to file property
    }

    const submitHandler = async (e) => { // define asynchronous function to handle form submission process
        e.preventDefault() // prevent default form submission to avoid page reload

        const formData = new FormData() // create new formdata object to handle multipart form submission with text and file data

        formData.append("fullname", input.fullname) // append fullname field from input state into formdata for api request
        formData.append("email", input.email) // append email field from input state into formdata
        formData.append("phoneNumber", input.phoneNumber) // append phone number field from input state into formdata
        formData.append("bio", input.bio) // append bio field from input state into formdata
        formData.append("skills", input.skills) // append skills field from input state into formdata

        if (input.file) { // check if file property in input state contains a valid file
            formData.append("file", input.file) // append selected resume file to formdata for upload
        }

        try { // start try block to handle potential request errors
            setLoading(true) // set loading state to true before sending request to indicate ongoing process

            const res = await axios.post( // send post request using axios to update user profile data
                `${USER_API_END_POINT}/profile/update`, // dynamically build full api endpoint for profile update
                formData, // pass formdata as request body containing form fields and optional file
                {
                    headers: { 'Content-Type': 'multipart/form-data' }, // set proper content type header for file upload
                    withCredentials: true // include authentication cookies for secure user verification
                }
            )

            if (res.data.success) { // verify if server response indicates successful profile update
                dispatch(setUser(res.data.user)) // dispatch redux action to update user data in global store with new profile
                toast.success(res.data.message) // display success message to notify user of successful update
            }
        } catch (error) { // handle exceptions during api request
            console.log(error) // log encountered error in console for debugging
            toast.error(error.response.data.message) // show error notification with message from server
        } finally { // execute cleanup actions after try-catch completes
            setLoading(false) // reset loading state to false after request completion
        }

        setOpen(false) // close update profile dialog after submission completes

        console.log(input) // output input state to console for debugging purpose
    }

    return (
        <div>
            <Dialog open={open}>
                <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}> {/* close dialog when user clicks outside modal area */}
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler}> {/* trigger submitHandler when user submits the form */}
                        <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={input.fullname} // bind input value to fullname from local state for controlled input
                                    onChange={changeEventHandler} // update fullname in state when input value changes
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email} // bind input value to email from local state for controlled input
                                    onChange={changeEventHandler} // update email field in state when user types
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="number" className="text-right">Number</Label>
                                <Input
                                    id="number"
                                    name="number"
                                    value={input.phoneNumber} // bind input to phoneNumber state to maintain two-way data binding
                                    onChange={changeEventHandler} // handle changes in phone number input and update state
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="bio" className="text-right">Bio</Label>
                                <Input
                                    id="bio"
                                    name="bio"
                                    value={input.bio} // bind bio input field to state for controlled form behavior
                                    onChange={changeEventHandler} // handle bio field updates and sync state accordingly
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="skills" className="text-right">Skills</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    value={input.skills} // bind skills input to state for editable list of user skills
                                    onChange={changeEventHandler} // update state when user modifies skills field
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="file" className="text-right">Resume</Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={fileChangeHandler} // handle file upload by updating state with selected file object
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            {
                                loading
                                    ? <Button className="w-full my-4">
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' /> {/* show spinning loader icon while API request is in progress */}
                                        Please wait
                                    </Button>
                                    : <Button type="submit" className="w-full my-4">Update</Button> // display submit button when not loading to allow user to update profile
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
