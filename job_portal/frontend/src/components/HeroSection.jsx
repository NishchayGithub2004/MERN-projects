import React, { useState } from 'react' // import React for JSX support and useState hook for managing local component state
import { Button } from './ui/button' // import Button component for interactive search action
import { Search } from 'lucide-react' // import Search icon from lucide-react library for button visualization
import { useDispatch } from 'react-redux' // import useDispatch hook to trigger Redux actions
import { setSearchedQuery } from '@/redux/jobSlice' // import Redux action to update searched job query in global state
import { useNavigate } from 'react-router-dom' // import useNavigate hook to navigate programmatically between routes

const HeroSection = () => { // define a functional component named 'HeroSection' to provide job search input and navigation functionality
    const [query, setQuery] = useState("") // initialize local state variable 'query' to store user-entered search text

    const dispatch = useDispatch() // create a Redux dispatch instance to send actions to the store
    const navigate = useNavigate() // create a navigate instance to perform client-side navigation

    const searchJobHandler = () => { // define a function 'searchJobHandler' to execute search logic on button click
        dispatch(setSearchedQuery(query)) // dispatch Redux action to set searched job query with current input value
        navigate("/browse") // navigate to '/browse' page to display search results
    }

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                <span className=' mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No. 1 Job Hunt Website</span>
                <h1 className='text-5xl font-bold'>Search, Apply & <br /> Get Your <span className='text-[#6A38C2]'>Dream Jobs</span></h1>
                <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <Input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)} // update query state in real time as user types into the input field
                        className='outline-none border-none w-full'
                    />
                    <Button 
                        onClick={searchJobHandler} // trigger searchJobHandler when user clicks the search button
                        className="rounded-r-full bg-[#6A38C2]"
                    >
                        <Search className='h-5 w-5' /> {/* render search icon inside the button for visual indication */}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection // export HeroSection component for reuse in other parts of the app
