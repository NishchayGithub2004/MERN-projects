import React, { useState } from 'react' // import React and useState hook for local state management
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog' // import Dialog components for modal
import { Label } from './ui/label' // import Label component for form fields
import { Input } from './ui/input' // import Input component for form inputs
import { Button } from './ui/button' // import Button component for interactive actions
import { Loader2 } from 'lucide-react' // import Loader2 icon for loading spinner
import { useDispatch, useSelector } from 'react-redux' // import Redux hooks to access state and dispatch actions
import axios from 'axios' // import axios for HTTP requests
import { USER_API_END_POINT } from '@/utils/constant' // import user API endpoint constant
import { setUser } from '@/redux/authSlice' // import Redux action to update user in store
import { toast } from 'sonner' // import toast for notifications

const UpdateProfileDialog = ({ open, setOpen }) => { // define functional component with open state and setter as props
    const [loading, setLoading] = useState(false); // local state to track loading during form submission
    
    const { user } = useSelector(store => store.auth); // select current user from Redux store

    const [input, setInput] = useState({ // local state for form inputs initialized from user data
        fullname: user?.fullname || "", // default to empty string if undefined
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.map(skill => skill) || "", // map skills array if exists
        file: user?.profile?.resume || "" // store uploaded resume file
    });

    const dispatch = useDispatch(); // get Redux dispatch function

    const changeEventHandler = (e) => { // handle text input changes
        setInput({ ...input, [e.target.name]: e.target.value }); // update corresponding field in input state
    }

    const fileChangeHandler = (e) => { // handle file input changes
        const file = e.target.files?.[0]; // get first selected file
        setInput({ ...input, file }) // update file in input state
    }

    const submitHandler = async (e) => { // handle form submission
        e.preventDefault(); // prevent default form submission behavior

        const formData = new FormData(); // create FormData object for multipart/form-data

        formData.append("fullname", input.fullname); // append fullname to formData
        formData.append("email", input.email); // append email
        formData.append("phoneNumber", input.phoneNumber); // append phone number
        formData.append("bio", input.bio); // append bio
        formData.append("skills", input.skills); // append skills
        
        if (input.file) { // check if resume file exists
            formData.append("file", input.file); // append file to formData
        }

        try {
            setLoading(true); // set loading state to true during API request
            
            const res = await axios.post(
                `${USER_API_END_POINT}/profile/update`, // API endpoint for updating profile
                formData, // send formData as request body
                {
                    headers: { 'Content-Type': 'multipart/form-data' }, // specify content type
                    withCredentials: true // include cookies for authentication
                }
            );

            if (res.data.success) { // check if API request succeeded
                dispatch(setUser(res.data.user)); // update user in Redux store
                toast.success(res.data.message); // show success notification
            }
        } catch (error) { // handle API errors
            console.log(error); // log error for debugging
            toast.error(error.response.data.message); // show error notification
        } finally {
            setLoading(false); // reset loading state after API request
        }

        setOpen(false); // close dialog after submission
        console.log(input); // debug log of input data
    }

    return (
        <div>
            <Dialog open={open}> 
                <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}> 
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler}> 
                        <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-4 items-center gap-4'>
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
                                loading 
                                ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> // show spinner and disable button while loading
                                : <Button type="submit" className="w-full my-4">Update</Button> // enable submit button when not loading
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog
