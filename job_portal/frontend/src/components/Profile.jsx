import React, { useState } from 'react' // import React library and useState hook for managing local component state
import Navbar from './shared/Navbar' // import Navbar component to render top navigation bar
import { Avatar, AvatarImage } from './ui/avatar' // import Avatar components to display user's profile image
import { Button } from './ui/button' // import Button component for clickable actions like editing profile
import { Contact, Mail, Pen } from 'lucide-react' // import icon components for contact info and edit button
import { Badge } from './ui/badge' // import Badge component to display user's skills
import { Label } from './ui/label' // import Label component for input or section labeling
import AppliedJobTable from './AppliedJobTable' // import AppliedJobTable component to list jobs the user has applied for
import UpdateProfileDialog from './UpdateProfileDialog' // import dialog component to update user profile details
import { useSelector } from 'react-redux' // import useSelector hook to access user data from Redux store
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs' // import custom hook to fetch applied job data

const isResume = true // define boolean variable indicating whether a resume exists for the user

const Profile = () => { // define a functional component named 'Profile' to display and manage user profile
    useGetAppliedJobs() // call custom hook to load applied job data when component mounts

    const [open, setOpen] = useState(false) // initialize local state variable 'open' to track visibility of update profile dialog

    const { user } = useSelector(store => store.auth) // extract user object from Redux auth slice to access profile information

    return (
        <div>
            <Navbar /> 
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24"> 
                            <AvatarImage 
                                src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" 
                                alt="profile" 
                            /> {/* render static placeholder avatar image for the user */}
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1> {/* display full name of the logged-in user */}
                            <p>{user?.profile?.bio}</p> {/* display user's bio from their profile data */}
                        </div>
                    </div>
                    <Button 
                        onClick={() => setOpen(true)} // toggle 'open' state to true when edit button is clicked to show dialog
                        className="text-right" 
                        variant="outline"
                    >
                        <Pen /> 
                    </Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail /> 
                        <span>{user?.email}</span> {/* render user's email address */}
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact /> 
                        <span>{user?.phoneNumber}</span> {/* render user's phone number */}
                    </div>
                </div>
                <div className='my-5'>
                    <h1>Skills</h1>
                    <div className='flex items-center gap-1'>
                        {
                            user?.profile?.skills.length !== 0 // check if user has any listed skills
                            ? user?.profile?.skills.map((item, index) => ( // iterate through each skill in the user's profile
                                <Badge key={index}>{item}</Badge> // render each skill as a Badge component
                            ))
                            : <span>NA</span> // display 'NA' if user has no skills added
                        }
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label> 
                    {
                        isResume // check if user has uploaded a resume
                        ? (
                            <a 
                                target='blank' // open resume in a new browser tab
                                href={user?.profile?.resume} // link to resume file URL from profile data
                                className='text-blue-500 w-full hover:underline cursor-pointer'
                            >
                                {user?.profile?.resumeOriginalName} {/* display original uploaded resume file name */}
                            </a>
                        ) : (
                            <span>NA</span> // display 'NA' if no resume available
                        )
                    }
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                <AppliedJobTable /> {/* render AppliedJobTable component to list user's applied jobs */}
            </div>
            <UpdateProfileDialog 
                open={open} // pass open state to control visibility of dialog
                setOpen={setOpen} // pass state updater to allow closing dialog from inside
            />
        </div>
    )
}

export default Profile // export Profile component for use in routing and integration with the app
