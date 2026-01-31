import React, { useState } from 'react' // import 'useState' hook to create and manage state variables
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux' // import 'useDispatch' hook from 'react-redux' library to dispatch actions to update redux states
import { setSearchedQuery } from '@/redux/jobSlice' // import 'setSearchedQuery' function from 'jobSlice' to update the 'searchedQuery' state
import { useNavigate } from 'react-router-dom' // import 'useNavigate' hook from 'react-router-dom' library to navigate to different routes

const HeroSection = () => {
    const [query, setQuery] = useState("") // create a state variable called 'query' to store the search query with initial value of an empty string and a function called 'setQuery' to update it's value

    const dispatch = useDispatch() // create an instance of 'useDispatch' hook to use it to dispatch actions to update redux states

    const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to navigate to different routes

    const searchJobHandler = () => { // create a function named 'searchJobHandler' to search jobs based on the search query
        dispatch(setSearchedQuery(query)) // dispatch value of 'query' to 'searchedQuery' state using 'setSearchedQuery' function
        navigate("/browse") // navigate to '/browse' route to see search results
    }

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                <span className=' mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>
                    No. 1 Job Hunt Website
                </span>
                <h1 className='text-5xl font-bold'>
                    Search, Apply & <br /> Get Your{' '}
                    <span className='text-[#6A38C2]'>Dream Jobs</span>
                </h1>
                <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <Input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)} // update value of 'query' state variable when value of input field changes
                        className='outline-none border-none w-full'
                    />
                    <Button
                        onClick={searchJobHandler} // clicking this button calls 'searchJobHandler' function to search jobs based on the search query input
                        className="rounded-r-full bg-[#6A38C2]"
                    >
                        <Search className='h-5 w-5' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection