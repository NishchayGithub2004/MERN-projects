import React, { useEffect, useState } from 'react' // import React and hooks useEffect for side-effects and useState for local state
import Navbar from './shared/Navbar' // import Navbar component for top navigation
import FilterCard from './FilterCard' // import FilterCard component for filtering jobs
import Job from './Job'; // import Job component to render individual job
import { useSelector } from 'react-redux'; // import useSelector hook to access Redux store state
import { motion } from 'framer-motion'; // import motion for animation effects

const Jobs = () => { // define a function component Jobs to display job list with filters
    const { allJobs, searchedQuery } = useSelector(store => store.job); // select allJobs array and searchedQuery from Redux store

    const [filterJobs, setFilterJobs] = useState(allJobs); // initialize local state filterJobs with allJobs; setFilterJobs updates filtered jobs

    useEffect(() => { // define effect to filter jobs whenever allJobs or searchedQuery changes
        if (searchedQuery) { // check if a search query exists
            const filteredJobs = allJobs.filter((job) => { // filter allJobs based on search query
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) || // include jobs where title matches query
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) || // include jobs where description matches query
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase()) // include jobs where location matches query
            })

            setFilterJobs(filteredJobs) // update filterJobs state with filtered results
        } else {
            setFilterJobs(allJobs) // if no search query, reset filterJobs to allJobs
        }
    }, [allJobs, searchedQuery]); // run effect when allJobs array or searchedQuery string changes

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span>Job not found</span> : ( // conditionally show message if no jobs match filter
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => ( // map over filtered jobs to render Job components
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }} // set initial animation state for motion
                                                animate={{ opacity: 1, x: 0 }} // set animate state for motion
                                                exit={{ opacity: 0, x: -100 }} // set exit animation state for motion
                                                transition={{ duration: 0.3 }} // set transition duration for animation
                                                key={job?._id}> {/* set key to job ID for React list rendering */}
                                                <Job job={job} /> {/* render Job component passing job object as prop */}
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

export default Jobs
