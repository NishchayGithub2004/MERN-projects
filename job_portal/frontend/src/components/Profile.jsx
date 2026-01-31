import React, { useState } from 'react' // import 'useState' hook to create and manage state variales
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable' // import 'AppliedJobTable' to render table of jobs user has applied to
import UpdateProfileDialog from './UpdateProfileDialog' // import 'UpdateProfileDialog' component to render UI to update user's profile
import { useSelector } from 'react-redux' // import 'useSelector' hook from 'react-redux' library to select states and functions from slices of redux store
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs' // import custom hook 'useGetAppliedJobs' to fetch applied jobs data

const isResume = true // create a state variable called 'isResume' to render resume with initial value of true

const Profile = () => {
    useGetAppliedJobs() // call the custom hook to fetch applied jobs data

    const [open, setOpen] = useState(false) // create a state variable called 'open' with initial value of false and a function called 'setOpen' to change it's value

    const { user } = useSelector(store => store.auth) // import 'user' object from 'auth' slice of redux store

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
                            />
                        </Avatar>
                        <div>
                            {/* render user's full name and bio */}
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            <p>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button 
                        onClick={() => setOpen(true)} // clicking this button sets value of 'open' to true
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
                            user?.profile?.skills.length !== 0 // if user has skills
                            ? user?.profile?.skills.map((item, index) => ( // render them by iterating over them and rendering them as badges with their indexes being their unique identifiers
                                <Badge key={index}>{item}</Badge>
                            ))
                            : <span>NA</span> // if user has no skills, render NA
                        }
                    </div>
                </div>
                
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {
                        isResume // if value of 'isResume' state is true ie user has a resume, render it's name with link to go to it
                        ? (
                            <a 
                                target='blank'
                                href={user?.profile?.resume}
                                className='text-blue-500 w-full hover:underline cursor-pointer'
                            >
                                {user?.profile?.resumeOriginalName}
                            </a>
                        ) : (
                            <span>NA</span> // otherwise render NA since user hasn't given any resume
                        )
                    }
                </div>
            </div>
            
            {/* render 'AppliedJobTable' component to display applied jobs ie jobs applied to by user */}

            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>
            
            {/* render 'UpdateProfileDialog' component and pass 'open' state and 'setOpen' function to it to open and close it */}
            
            <UpdateProfileDialog 
                open={open}
                setOpen={setOpen}
            />
        </div>
    )
}

export default Profile