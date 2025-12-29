import React from 'react' // import React to enable JSX and define functional components
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel' // import Carousel components to create a category slider
import { Button } from './ui/button' // import Button component for interactive category selection
import { useDispatch } from 'react-redux' // import useDispatch hook to dispatch Redux actions
import { useNavigate } from 'react-router-dom' // import useNavigate hook to navigate between routes programmatically
import { setSearchedQuery } from '@/redux/jobSlice' // import Redux action to update searched query state

const category = [ // define an array named 'category' that holds job category labels displayed in the carousel
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
]

const CategoryCarousel = () => { // define a functional component named 'CategoryCarousel' to render job categories and handle job searches
    const dispatch = useDispatch() // initialize Redux dispatch function to send actions to store

    const navigate = useNavigate() // initialize navigate function to programmatically redirect user to another route

    const searchJobHandler = ( // define a function 'searchJobHandler' to handle job category selection and navigation
        query // parameter 'query' represents selected job category text
    ) => { 
        dispatch(setSearchedQuery(query)) // update Redux state with selected category as searched query
        navigate("/browse") // redirect user to browse page to show filtered job listings
    }

    return (
        <div>
            <Carousel className="w-full max-w-xl mx-auto my-20">
                <CarouselContent>
                    {
                        category.map((cat, index) => ( // iterate through 'category' array to create carousel items dynamically
                            <CarouselItem className="md:basis-1/2 lg-basis-1/3" key={index}>
                                <Button 
                                    onClick={() => searchJobHandler(cat)} // call searchJobHandler with selected category when button is clicked
                                    variant="outline"
                                    className="rounded-full"
                                >
                                    {cat} {/* render the category name text dynamically inside the button */}
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

export default CategoryCarousel // export CategoryCarousel component so it can be reused in other parts of the app
