import React, { useState } from 'react' // import React to define a component and useState hook to manage state in the component
import { Button } from './ui/button' // import Button component for clickable button UI
import { Search } from 'lucide-react' // import Search icon component from lucide-react icon library
import { useDispatch } from 'react-redux' // import useDispatch hook to send actions to Redux store
import { setSearchedQuery } from '@/redux/jobSlice' // import setSearchedQuery action to update the searched job query in Redux store
import { useNavigate } from 'react-router-dom' // import useNavigate hook to programmatically navigate to a different route

const HeroSection = () => { // define a functional component named HeroSection
    const [query, setQuery] = useState("") // define a state variable 'query' initialized with an empty string to store the search text input by user
    
    const dispatch = useDispatch() // create a dispatch function instance to dispatch Redux actions
    const navigate = useNavigate() // create a navigate function instance to perform route navigation programmatically

    const searchJobHandler = () => { // define a function named searchJobHandler to handle search button click
        dispatch( // call dispatch function to send an action to Redux store
            setSearchedQuery(query) // call setSearchedQuery action creator with argument 'query' to update Redux jobSlice with the current search query
        )
        navigate( // call navigate function to redirect user to a new route
            "/browse" // specify '/browse' as the route path to navigate to after search
        )
    }

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                <span className=' mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No. 1 Job Hunt Website</span>
                <h1 className='text-5xl font-bold'>Search, Apply & <br /> Get Your <span className='text-[#6A38C2]'>Dream Jobs</span></h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid aspernatur temporibus nihil tempora dolor!</p>
                <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)} // call setQuery with argument e.target.value to update query state with current input value
                        className='outline-none border-none w-full'
                    />
                    <Button 
                        onClick={searchJobHandler} // assign searchJobHandler function to be triggered when button is clicked
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
