import React, { useEffect } from 'react' // import React and useEffect hook to handle lifecycle logic
import Navbar from './shared/Navbar' // import Navbar component for top navigation
import Job from './Job' // import Job component to render each job item
import { useDispatch, useSelector } from 'react-redux' // import Redux hooks to read and dispatch state
import { setSearchedQuery } from '@/redux/jobSlice' // import action creator to update searched query in Redux
import useGetAllJobs from '@/hooks/useGetAllJobs' // import custom hook to fetch all jobs from API

const Browse = () => { // define a function component Browse to display all searched jobs
    useGetAllJobs(); // call custom hook to fetch and populate all jobs on component mount
    
    const { allJobs } = useSelector(store => store.job); // extract allJobs array from Redux job slice using useSelector
    
    const dispatch = useDispatch(); // create dispatch function to send actions to Redux store
    
    useEffect(() => { // define a useEffect hook to handle cleanup when component unmounts
        return () => { // define cleanup function to run on unmount
            dispatch(setSearchedQuery("")); // dispatch action to reset searched query to empty string
        }
    }, []); // pass empty dependency array to run this effect only once after mount/unmount
    
    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10'>Search Results ({allJobs.length})</h1>
                <div className='grid grid-cols-3 gap-4'>
                    {
                        allJobs.map((job) => { // iterate through allJobs array to render each job
                            return (
                                <Job 
                                    key={job._id} // assign unique key for each job component using job ID
                                    job={job} // pass individual job object as prop to Job component
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Browse // export Browse component for use in routing or other components
