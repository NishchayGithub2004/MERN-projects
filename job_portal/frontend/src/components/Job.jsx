import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom' // import 'useNavigate' hook from 'react-router-dom' library to navigate to different routes

const Job = ({ job }) => { // create a functional component named 'Job' to render information about a job
    const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to navigate to different routes

    const daysAgoFunction = (mongodbTime) => { // create a function to calculate the number of days ago a job was posted, it takes date in MongoDB format
        const createdAt = new Date(mongodbTime) // convert the time into a Javascript date object
        const currentTime = new Date() // create a date object of current date the function is running
        const timeDifference = currentTime - createdAt // find the time difference b/w current time and time of job posted
        return Math.floor(timeDifference / (1000 * 60 * 60 * 24)) // convert the time difference into days and return it
    }

    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>
                    {/* if the job was posted today, show 'Today' otherwise show the number of days ago the job was posted */}
                    {daysAgoFunction(job?.createdAt) === 0
                        ? "Today"
                        : `${daysAgoFunction(job?.createdAt)} days ago`}
                </p>
                <Button variant="outline" className="rounded-full" size="icon">
                    <Bookmark />
                </Button>
            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} /> {/* render the company logo */}
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1> {/* render the company name */}
                    <p className='text-sm text-gray-500'>India</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1> {/* render the job title */}
                <p className='text-sm text-gray-600'>{job?.description}</p> {/* render the job description */}
            </div>

            <div className='flex items-center gap-2 mt-4'>
                <Badge className='text-blue-700 font-bold' variant="ghost">
                    {job?.position} Positions {/* render the number of positions/vacancies for the job */}
                </Badge>
                <Badge className='text-[#F83002] font-bold' variant="ghost">
                    {job?.jobType} {/* render the job type */}
                </Badge>
                <Badge className='text-[#7209b7] font-bold' variant="ghost">
                    {job?.salary}LPA {/* render the job salary */}
                </Badge>
            </div>

            <div className='flex items-center gap-4 mt-4'>
                <Button
                    onClick={() => navigate(`/description/${job?._id}`)} // clicking this button takes user to job description
                    variant="outline"
                >
                    Details
                </Button>
                <Button className="bg-[#7209b7]">Save For Later</Button>
            </div>
        </div>
    )
}

export default Job