import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux' // from 'react-redux' library, import 'useDispatch' hook to dispatch actions to redux store to update values of redux states
import { useNavigate } from 'react-router-dom' // from 'react-router-dom' library, import 'useNavigate' hook to navigate between routes programmatically
import { setSearchedQuery } from '@/redux/jobSlice' // from 'jobSlice', import 'setSearchedQuery' function to update value of 'searchedQuery' state in redux store

const category = [ // create an array of categories of jobs
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
]

const CategoryCarousel = () => { // create a functional component named 'CategoryCarousel' to render a carousel of job categories
    const dispatch = useDispatch() // create an instance of 'useDispatch' hook to use it to dispatch actions to update states in redux slices
    
    const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to navigate between routes programmatically

    const searchJobHandler = (query) => { // create a function named 'searchJobHandler' to search for a job based on the category of the job, that takes 'query' as an argument
        dispatch(setSearchedQuery(query)) // dispatch 'setSearchedQuery' action with 'query' as the modified value of 'searchedQuery' state
        navigate("/browse") // navigate to '/browse' route to show jobs based on category
    }

    return (
        <div>
            <Carousel className="w-full max-w-xl mx-auto my-20">
                <CarouselContent>
                    {
                        category.map((cat, index) => ( // iterate over elements of 'category' array as 'cat' with it's index
                            <CarouselItem
                                className="md:basis-1/2 lg-basis-1/3"
                                key={index} // index of element is the unique identifier of each item in the carousel
                            >
                                <Button
                                    onClick={() => searchJobHandler(cat)} // clicking this button calls 'searchJobHandler' function with current category as argument
                                    variant="outline"
                                    className="rounded-full"
                                >
                                    {cat} {/* render current category as text of the button */}
                                </Button>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default CategoryCarousel