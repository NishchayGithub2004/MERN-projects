import React from 'react'
import LatestJobCards from './LatestJobCards'
import { useSelector } from 'react-redux' // import 'useSelector' hook from 'react-redux' library to access slices from redux store

const LatestJobs = () => { // create a functional component named 'LatestJobs' to render latest jobs
    const { allJobs } = useSelector(store => store.job) // access 'allJobs' state from 'job' slice

    return (
        <div className='max-w-7xl mx-auto my-20'>
            <h1 className='text-4xl font-bold'>
                <span className='text-[#6A38C2]'>Latest & Top </span> Job Openings
            </h1>
            <div className='grid grid-cols-3 gap-4 my-5'>
                {
                    allJobs.length <= 0 // if 'allJobs' array is empty ie no jobs are present
                    ? <span>No Job Available</span>
                    : allJobs.slice(0, 6).map((job) => ( // otherwise iterate over first 6 jobs ie first 6 elements of 'allJobs' array
                        <LatestJobCards // render 'LatestJobCards' component for each job
                            key={job._id} // unique ID of the job is the component's unique identifier
                            job={job} // pass 'job' object as a prop to 'LatestJobCards' component ie job details
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default LatestJobs