import React, { useState } from 'react' // import React and useState hook for local state
import Navbar from './shared/Navbar' // import Navbar component for top navigation
import { Avatar, AvatarImage } from './ui/avatar' // import Avatar components for profile picture
import { Button } from './ui/button' // import Button component for interactive actions
import { Contact, Mail, Pen } from 'lucide-react' // import icons for UI display
import { Badge } from './ui/badge' // import Badge component to display skills
import { Label } from './ui/label' // import Label component for form labels
import AppliedJobTable from './AppliedJobTable' // import AppliedJobTable to list applied jobs
import UpdateProfileDialog from './UpdateProfileDialog' // import dialog component for updating profile
import { useSelector } from 'react-redux' // import useSelector hook to access Redux store
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs' // import custom hook to fetch applied jobs

const isResume = true; // boolean indicating whether user has uploaded a resume

const Profile = () => { // define function component Profile to show user profile and applied jobs
    useGetAppliedJobs(); // call custom hook to fetch applied jobs on component mount

    const [open, setOpen] = useState(false); // local state to control update profile dialog visibility

    const {user} = useSelector(store=>store.auth); // select current user from Redux store

    return (
        <div>
            <Navbar /> 
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24"> 
                            <AvatarImage src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" alt="profile" /> {/* set avatar image for user profile */}
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1> {/* display user's full name */}
                            <p>{user?.profile?.bio}</p> {/* display user's bio */}
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen /></Button> {/* open update profile dialog when Pen button is clicked */}
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span> {/* display user's email */}
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber}</span> {/* display user's phone number */}
                    </div>
                </div>
                <div className='my-5'>
                    <h1>Skills</h1>
                    <div className='flex items-center gap-1'>
                        {
                            user?.profile?.skills.length !== 0 
                            ? user?.profile?.skills.map((item, index) => <Badge key={index}>{item}</Badge>) // map over skills array and display each skill as Badge
                            : <span>NA</span> // show NA if no skills available
                        }
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {
                        isResume 
                        ? <a 
                            target='blank' 
                            href={user?.profile?.resume} 
                            className='text-blue-500 w-full hover:underline cursor-pointer'>
                            {user?.profile?.resumeOriginalName}
                          </a> 
                        // link to user's uploaded resume
                        : <span>NA</span> // show NA if no resume uploaded
                    }
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile
