import React from 'react' // import React library to define and render functional components
import LatestJobCards from './LatestJobCards' // import LatestJobCards component to display individual job details as cards
import { useSelector } from 'react-redux' // import useSelector hook to access state from Redux store

const LatestJobs = () => { // define a functional component named 'LatestJobs' to show a section of latest job postings
    const { allJobs } = useSelector(store => store.job) // extract allJobs array from Redux store to get all available job listings

    return (
        <div className='max-w-7xl mx-auto my-20'>
            <h1 className='text-4xl font-bold'>
                <span className='text-[#6A38C2]'>Latest & Top </span> Job Openings
            </h1>
            <div className='grid grid-cols-3 gap-4 my-5'>
                {
                    allJobs.length <= 0 // check if there are no jobs in the array
                    ? <span>No Job Available</span> // display message when job list is empty
                    : allJobs.slice(0, 6).map((job) => ( // take first 6 jobs from allJobs array to show latest openings
                        <LatestJobCards 
                            key={job._id} // assign unique key for React rendering optimization using job ID
                            job={job} // pass current job object as prop to LatestJobCards component for rendering
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default LatestJobs // export LatestJobs component to make it available for import in other files
