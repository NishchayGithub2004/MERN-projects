import React from 'react' // import React library to create a functional component
import { Badge } from './ui/badge' // import Badge component to visually display job details like type or salary
import { useNavigate } from 'react-router-dom' // import useNavigate hook for programmatic navigation between routes

const LatestJobCards = ({ job }) => { // define a functional component named 'LatestJobCards' to display individual job cards; receives job object as prop
    const navigate = useNavigate() // initialize navigation function to redirect user when a card is clicked
    
    return (
        <div 
            onClick={() => navigate(`/description/${job._id}`)} // navigate to job description page using the job’s unique ID when the card is clicked
            className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer'
        >
            <div>
                <h1 className='font-medium text-lg'>{job?.company?.name}</h1> {/* render company name dynamically from job prop */}
                <p className='text-sm text-gray-500'>India</p> {/* display static company location */}
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1> {/* render job title */}
                <p className='text-sm text-gray-600'>{job?.description}</p> {/* render job description */}
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge> {/* show available job positions */}
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge> {/* show job type (e.g., full-time, part-time) */}
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge> {/* show job salary in LPA */}
            </div>
        </div>
    )
}

export default LatestJobCards // export LatestJobCards component for reuse in job listing sections
