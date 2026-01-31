import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom' // import 'useNavigate' hook from 'react-router-dom' library to navigate to different pages

const LatestJobCards = ({ job }) => { // create a functional component named 'LatestJobCards' to display latest job card
    const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to navigate to different pages
    
    return (
        <div 
            onClick={() => navigate(`/description/${job._id}`)} // clicking this container takes user to job description page
            className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer'
        >
            <div>
                <h1 className='font-medium text-lg'>{job?.company?.name}</h1> {/* render the name of company that posted the job */}
                <p className='text-sm text-gray-500'>India</p>
            </div>
            <div>
                {/* render job title and description */}
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                {/* render the number of positions/vacancies of the job, job type and salary */}
                <Badge className='text-blue-700 font-bold' variant="ghost">
                    {job?.position} Positions
                </Badge>
                <Badge className='text-[#F83002] font-bold' variant="ghost">
                    {job?.jobType}
                </Badge>
                <Badge className='text-[#7209b7] font-bold' variant="ghost">
                    {job?.salary}LPA
                </Badge>
            </div>
        </div>
    )
}

export default LatestJobCards