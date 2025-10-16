import React from 'react'; // import React to define a functional component
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel'; // import Carousel components for slider functionality
import { Button } from './ui/button'; // import Button component for clickable category buttons
import { useDispatch } from 'react-redux'; // import useDispatch hook to send actions to Redux store
import { useNavigate } from 'react-router-dom'; // import useNavigate hook to programmatically navigate between routes
import { setSearchedQuery } from '@/redux/jobSlice'; // import action creator to update searched job query in Redux state

const category = [ // define an array of job category names to be displayed in the carousel
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
];

const CategoryCarousel = () => { // define a functional component CategoryCarousel to render job categories
    const dispatch = useDispatch(); // create a dispatch function to dispatch Redux actions
    
    const navigate = useNavigate(); // create a navigate function to redirect users programmatically
    
    const searchJobHandler = (query) => { // define a function searchJobHandler that takes a category name as query argument
        dispatch(setSearchedQuery(query)); // dispatch Redux action to set searched job query to the selected category
        navigate("/browse"); // navigate user to the browse page to view filtered jobs
    };

    return (
        <div>
            <Carousel className="w-full max-w-xl mx-auto my-20">
                <CarouselContent>
                    {
                        category.map((cat, index) => ( // iterate over category array to generate a carousel item for each category
                            <CarouselItem className="md:basis-1/2 lg-basis-1/3" key={index}> 
                                <Button 
                                    onClick={() => searchJobHandler(cat)} // attach click handler to trigger searchJobHandler with selected category
                                    variant="outline" 
                                    className="rounded-full"
                                >
                                    {cat}
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
};

export default CategoryCarousel; // export CategoryCarousel component for use in other parts of the app
