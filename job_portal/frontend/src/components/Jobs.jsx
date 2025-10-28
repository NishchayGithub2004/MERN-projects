import React, { useEffect, useState } from 'react' // import React library and hooks useEffect for side effects, useState for managing local component state
import Navbar from './shared/Navbar' // import Navbar component to render top navigation bar
import FilterCard from './FilterCard' // import FilterCard component to allow filtering of job listings
import Job from './Job' // import Job component to display individual job details
import { useSelector } from 'react-redux' // import useSelector hook to access state data from Redux store
import { motion } from 'framer-motion' // import motion component from framer-motion for animation effects

const Jobs = () => { // define a functional component named 'Jobs' to display job listings with filtering functionality
    const { allJobs, searchedQuery } = useSelector(store => store.job) // extract allJobs array and searchedQuery string from Redux job slice
    
    const [filterJobs, setFilterJobs] = useState(allJobs) // initialize state variable filterJobs with allJobs to hold filtered job results

    useEffect(() => { // run side effect when allJobs or searchedQuery changes
        if (searchedQuery) { // check if user has entered a search query
            const filteredJobs = allJobs.filter((job) => ( // create new array by filtering allJobs that match the search query
                job.title.toLowerCase().includes(searchedQuery.toLowerCase()) || // include job if title contains searched query
                job.description.toLowerCase().includes(searchedQuery.toLowerCase()) || // include job if description contains searched query
                job.location.toLowerCase().includes(searchedQuery.toLowerCase()) // include job if location contains searched query
            ))
            setFilterJobs(filteredJobs) // update filterJobs state with the filtered job list
        } else {
            setFilterJobs(allJobs) // reset filterJobs to allJobs when no search query is active
        }
    }, [allJobs, searchedQuery]) // dependencies ensure filtering happens whenever job data or query changes

    return (
        <div>
            <Navbar /> 
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard /> 
                    </div>
                    {
                        filterJobs.length <= 0 ? <span>Job not found</span> : ( // show 'Job not found' if no jobs match the filter
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => ( // iterate through filtered job list and render each Job component
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }} // start animation with hidden position shifted right
                                                animate={{ opacity: 1, x: 0 }} // animate into visible position
                                                exit={{ opacity: 0, x: -100 }} // define exit animation moving left
                                                transition={{ duration: 0.3 }} // define animation duration as 0.3 seconds
                                                key={job?._id} // assign unique key using job ID for React list rendering optimization
                                            >
                                                <Job job={job} /> {/* render Job component passing job object as prop to display job details */}
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs // export Jobs component for routing and usage across the application
