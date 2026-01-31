import React, { useEffect, useState } from 'react' // import 'useEffect' hook to run side-effects and 'useState' hook to create and manage state variables
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import { useSelector } from 'react-redux' // import 'useSelector' hook from 'react-redux' to access a slice from redux store
import { motion } from 'framer-motion' // import 'motion' component from 'framer-motion' for animation effects

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job) // extract 'allJobs' and 'searchedQuery' states from 'job' slice of redux store
    
    const [filterJobs, setFilterJobs] = useState(allJobs) // create a state variable called 'filterJobs' to store jobs found by filtering by categories
    // it's initial value is 'allJobs' ie all the jobs since initially no filter is applied, and a function called 'setFilterJobs' to change it's value by filtering

    useEffect(() => {
        if (searchedQuery) { // if search query is given by the user to give filtered results
            const filteredJobs = allJobs.filter((job) => ( // filter jobs based on search query by checking if job's title, description or location includes the search query string
                // 'toLowerCase' is used to make the search case-insensitive
                job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(searchedQuery.toLowerCase())
            ))
            setFilterJobs(filteredJobs) // set value of 'filterJobs' to 'filteredJobs' ie the jobs filtered ie got by search results
        } else { // if no search query is given
            setFilterJobs(allJobs) // set value of 'filterJobs' to 'allJobs' ie all the jobs since no filter is given so all jobs are displayed
        }
    }, [allJobs, searchedQuery]) // re-run the effect when 'allJobs' or 'searchedQuery' changes ie when jobs change or another search query is given

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? ( // if 'filteredJobs' array has no elements, it means that no job was found by filtering
                            <span>Job not found</span>
                        ) : ( // if 'filteredJobs' array has elements, it means that some jobs were found by filtering
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => ( // iterate over 'filteredJobs' array ie jobs found as search result as 'job'
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id} // current job's unique ID works as the unique ID of it's container
                                            >
                                                <Job job={job} /> {/* render 'Job' component for current job with it's details passed as props to render job details */}
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