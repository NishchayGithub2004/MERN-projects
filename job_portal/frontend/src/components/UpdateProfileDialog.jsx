import React, { useState } from 'react' // import 'useState' hook to create and manage state variales
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux' // from 'react-redux' library, import 'useDispatch' hook to dispatch actions through functions to update value of state variables and 'useSelector' hook to access state variables of slices of redux store
import axios from 'axios' // import 'axios' library to make HTTP requests to the backend
import { USER_API_END_POINT } from '@/utils/constant' // import the backend URL to make HTTP requests to
import { setUser } from '@/redux/authSlice' // import 'setUser' action from 'authSlice' slice of redux store to update user details
import { toast } from 'sonner' // import 'toast' function from 'sonner' library to display toast/pop-up notifications

const UpdateProfileDialog = ({ open, setOpen }) => { // create a functional component called 'UpdateProfileDialog' to render UI to update user profile, it takes 'open' state variable and 'setOpen' function to change it's value as props
    const [loading, setLoading] = useState(false) // create a state variable called 'loading' to track whether profile updating is happening or not with initial value of false and a function called 'setLoading' to change it's value

    const { user } = useSelector(store => store.auth) // import 'user' object from 'auth' slice of redux store to get user details

    // create a state variable called 'input' to store user profile details, it is an object that contains following details of user as properties:
    // full name, email, phone number, bio, skills, and resume file and a function called 'setInput' to change the values of these properties
    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.map(skill => skill) || "",
        file: user?.profile?.resume || ""
    })

    const dispatch = useDispatch() // create an instance of 'useDispatch' hook to use it to dispatch actions to update values of state variables through functions

    const changeEventHandler = (e) => { // create a function called 'changeEventHandler' to update values of properties given in input fields, it takes event object as argument
        setInput({ ...input, [e.target.name]: e.target.value }) // copy the existing properties and their values using spread operator and give updated value of property given in input field
    }

    const fileChangeHandler = (e) => { // create a function called 'fileChangeHandler' to update value of file property given in input field, it takes event object as argument
        const file = e.target.files?.[0] // get the file from the input field
        setInput({ ...input, file }) // copy the existing properties and their values using spread operator and give updated value of file property given in input field
    }

    const submitHandler = async (e) => { // create a function called 'submitHandler' to do some things before, during and after submitting form, it takes event object as argument
        e.preventDefault() // prevent form from submitting right after clicking submit button so that we can do some things before actually submitting the form

        const formData = new FormData() // create an instance of 'FormData' object to store form data

        // to the object, add values of input fields for full name, email, phone number, bio, skills and resume file (if provided)

        formData.append("fullname", input.fullname)
        formData.append("email", input.email)
        formData.append("phoneNumber", input.phoneNumber)
        formData.append("bio", input.bio)
        formData.append("skills", input.skills)

        if (input.file) {
            formData.append("file", input.file)
        }

        try {
            setLoading(true) // set value of state variable 'loading' to true

            const res = await axios.post( // make a POST request to the backend to update user profile
                `${USER_API_END_POINT}/profile/update`, // this is the URL to make the POST request to
                formData, // this is the form data to be given to the backend
                {
                    headers: { 'Content-Type': 'multipart/form-data' }, // the data will be provided in the form of form data
                    withCredentials: true // cookies will also be sent to the backend for authentication
                }
            )

            if (res.data.success) { // if backend sends a response successfully
                dispatch(setUser(res.data.user)) // send form details to 'user' object using 'setUser' function to update the user's details
                toast.success(res.data.message) // display success message sent by the backend as a toast/pop-up messages
            }
        } catch (error) { // if an error occurs while submitting the form to backend to update user details
            console.log(error) // log the error to the console to know what error occured
            toast.error(error.response.data.message) // show the error message sent by the backend as a toast/pop-up message
        } finally {
            setLoading(false) // finally set value of 'loading' state variable to false
        }
    }

    return (
        <div>
            <Dialog open={open}>
                <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}> {/* interacting with this dialog box sets value of 'open' to false */}
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={submitHandler}> {/* submitting this form calls 'submitHandler' function */}
                        <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                {/* render input fields for full name, email, phone number, bio, skills and resume file */}

                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="number" className="text-right">Number</Label>
                                <Input
                                    id="number"
                                    name="number"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="bio" className="text-right">Bio</Label>
                                <Input
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="skills" className="text-right">Skills</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    value={input.skills}
                                    onChange={changeEventHandler}
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
                                    onChange={fileChangeHandler}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        
                        <DialogFooter>
                            {
                                loading // if value of 'loading' is false, render loading spinner with 'Please wait' text, otherwise render the button clicking which submits the form data
                                    ? <Button className="w-full my-4">
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Please wait
                                    </Button>
                                    : <Button type="submit" className="w-full my-4">Update</Button>
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog