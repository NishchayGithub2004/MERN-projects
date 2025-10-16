import React from 'react' // import React library to build the component
import { Button } from './ui/button' // import Button component for interactive UI buttons
import { Bookmark } from 'lucide-react' // import Bookmark icon from lucide-react icon library
import { Avatar, AvatarImage } from './ui/avatar' // import Avatar components to display company logos
import { Badge } from './ui/badge' // import Badge component for job details highlighting
import { useNavigate } from 'react-router-dom' // import useNavigate hook for client-side navigation

const Job = ({ job }) => { // receive a single job object as prop to display job details
    const navigate = useNavigate() // initialize navigation function for route redirection

    const daysAgoFunction = (mongodbTime) => { // define function to calculate how many days ago the job was posted, taking mongodbTime as input
        const createdAt = new Date(mongodbTime) // convert MongoDB timestamp to Date object
        const currentTime = new Date() // get the current date and time
        const timeDifference = currentTime - createdAt // calculate difference in milliseconds between now and creation time
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60)) // convert milliseconds to whole days by dividing by milliseconds per day
    }

    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>
                    {daysAgoFunction(job?.createdAt) === 0 
                        ? "Today" 
                        : `${daysAgoFunction(job?.createdAt)} days ago`
                    } 
                    {/* display 'Today' if created today, else show number of days since posting */}
                </p>
                <Button variant="outline" className="rounded-full" size="icon">
                    <Bookmark />
                </Button>
            </div>
            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} /> {/* display company logo dynamically using AvatarImage */}
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1> {/* show company name */}
                    <p className='text-sm text-gray-500'>India</p> {/* static company location */}
                </div>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1> {/* show job title */}
                <p className='text-sm text-gray-600'>{job?.description}</p> {/* show job description */}
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge> {/* show number of available positions */}
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge> {/* show type of job such as full-time or part-time */}
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge> {/* show salary offered in LPA */}
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button 
                    onClick={() => navigate(`/description/${job?._id}`)} // trigger navigation to job description page using job ID
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
