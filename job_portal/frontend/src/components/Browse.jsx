import React, { useEffect } from 'react' // import React for JSX support and useEffect hook to handle side effects
import Navbar from './shared/Navbar' // import Navbar component for consistent top navigation
import Job from './Job' // import Job component to display each job item
import { useDispatch, useSelector } from 'react-redux' // import Redux hooks to read from and dispatch actions to the global store
import { setSearchedQuery } from '@/redux/jobSlice' // import action to reset the searched query state
import useGetAllJobs from '@/hooks/useGetAllJobs' // import custom hook that fetches all jobs when the component mounts

const Browse = () => { // define a functional component named 'Browse' to display a list of all available jobs with search results
    useGetAllJobs() // call custom hook to fetch all jobs and update Redux store when component renders

    const { allJobs } = useSelector(store => store.job) // extract 'allJobs' array from Redux job slice to access job listings

    const dispatch = useDispatch() // initialize dispatch function to trigger Redux actions

    useEffect(() => { // use effect hook to define cleanup logic that runs when component mounts
        return () => { // specify cleanup callback executed during unmount
            dispatch(setSearchedQuery("")) // reset searched query in Redux store to prevent showing old search data
        }
    }, []) // empty dependency array ensures effect runs only once during mount

    return (
        <div>
            <Navbar /> 
            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10'>Search Results ({allJobs.length})</h1> {/* display count of fetched jobs dynamically */}
                <div className='grid grid-cols-3 gap-4'>
                    {
                        allJobs.map((job) => ( // iterate over all jobs to render each one dynamically
                            <Job key={job._id} job={job}/> // render Job component for each job, passing job details as props and assigning unique key
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Browse // export the Browse component so it can be used in other parts of the app
