import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import { useDispatch, useSelector } from 'react-redux' // import 'useDispatch' hook to dispatch actions to redux store and 'useSelector' hook to select state from the Redux store
import { setSearchedQuery } from '@/redux/jobSlice' // import 'setSearchedQuery' function from 'jobSlice' to modify value of search string written to search for a job
import useGetAllJobs from '@/hooks/useGetAllJobs' // import 'useGetAllJobs' custom hook to get all jobs from backend

const Browse = () => { // create a functional component named 'Browse' to render jobs shown as result of searching for them
    useGetAllJobs() // call 'useGetAllJobs' custom hook

    const { allJobs } = useSelector(store => store.job) // extract 'allJobs' array from 'job' slice of redux store to access all jobs posted by recruiters

    const dispatch = useDispatch() // create an instance of 'useDispatch' hook to use it to dispatch actions to update states in redux slices

    // create a side-effect using 'useEffect' hook that runs only once (when the component mounts) that dispatched empty string as modified value of 'searchedQuery' state using 'setSearchedQuery' function

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""))
        }
    }, [])

    return (
        <div>
            <Navbar />

            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10'>
                    Search Results ({allJobs.length}) {/* render number of jobs found as a result of search query */}
                </h1>
                <div className='grid grid-cols-3 gap-4'>
                    {
                        // iterate over 'allJobs' array of objects ie jobs found from search string and render 'Job' component for each job
                        allJobs.map((job) => (
                            <Job key={job._id} job={job} /> // pass current object as prop with it's unique ID working as it's unique identifier
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Browse