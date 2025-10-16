import React from 'react' // import React to define functional component
import LatestJobCards from './LatestJobCards'; // import LatestJobCards component for displaying individual job cards
import { useSelector } from 'react-redux'; // import useSelector hook to access Redux store state

const LatestJobs = () => { // define a function component LatestJobs to display top 6 job openings
    const { allJobs } = useSelector(store => store.job); // select allJobs array from Redux store to get current job data

    return (
        <div className='max-w-7xl mx-auto my-20'>
            <h1 className='text-4xl font-bold'><span className='text-[#6A38C2]'>Latest & Top </span> Job Openings</h1>
            <div className='grid grid-cols-3 gap-4 my-5'>
                {
                    allJobs.length <= 0 
                    ? <span>No Job Available</span> // show message if no jobs exist
                    : allJobs?.slice(0, 6) // limit to first 6 jobs
                        .map((job) => <LatestJobCards key={job._id} job={job} />)  // pass each job object to LatestJobCards component for display
                }
            </div>
        </div>
    )
}

export default LatestJobs
