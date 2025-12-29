import React from 'react' // import React to define and render the functional component
import { Button } from './ui/button' // import Button component to render clickable UI buttons
import { Bookmark } from 'lucide-react' // import Bookmark icon component for job save functionality
import { Avatar, AvatarImage } from './ui/avatar' // import Avatar and AvatarImage components to display company logos
import { Badge } from './ui/badge' // import Badge component to display job info tags such as type, position, salary
import { useNavigate } from 'react-router-dom' // import useNavigate hook to enable navigation to job detail pages

const Job = ({ job }) => { // define a functional component named 'Job' to display information about a single job post, taking 'job' as prop
    const navigate = useNavigate() // initialize navigate function for route redirection

    const daysAgoFunction = (mongodbTime) => { // define function to calculate days passed since job creation from MongoDB timestamp
        const createdAt = new Date(mongodbTime) // convert MongoDB time to Date object
        const currentTime = new Date() // get current date and time
        const timeDifference = currentTime - createdAt // compute difference in milliseconds between now and job creation time
        return Math.floor(timeDifference / (1000 * 60 * 60 * 24)) // convert milliseconds to days by dividing by milliseconds per day
    }

    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>
                    {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`} {/* display how many days ago job was posted, or 'Today' if 0 days */}
                </p>
                <Button variant="outline" className="rounded-full" size="icon"> 
                    <Bookmark /> 
                </Button>
            </div>
            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} /> {/* dynamically display company logo using AvatarImage source from job prop */}
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1> {/* display company name fetched from job prop */}
                    <p className='text-sm text-gray-500'>India</p> {/* display static company location text */}
                </div>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1> {/* display job title text */}
                <p className='text-sm text-gray-600'>{job?.description}</p> {/* display job description text */}
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge> {/* display number of open positions */}
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge> {/* display job type such as full-time or part-time */}
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge> {/* display offered salary in LPA format */}
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button 
                    onClick={() => navigate(`/description/${job?._id}`)} // navigate to job detail page when clicked using job ID
                    variant="outline"
                >
                    Details
                </Button>
                <Button className="bg-[#7209b7]">Save For Later</Button> {/* render button for saving job for later viewing */}
            </div>
        </div>
    )
}

export default Job // export Job component for use in job listings or other parent components
