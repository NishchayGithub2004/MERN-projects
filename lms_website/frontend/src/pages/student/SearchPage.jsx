import React, { useState } from "react"; // import 'useState' hook to manange state variables
import Filter from "./Filter"; // import 'Filter' component
import SearchResult from "./SearchResult"; // import 'SearchResult' component
import { Skeleton } from "@/components/ui/skeleton"; // import 'Skeleton' component from shadCN UI library
import { useGetSearchCourseQuery } from "@/features/api/courseApi"; // import 'useGetSearchCourseQuery' hook
import { Link, useSearchParams } from "react-router-dom"; // import 'Link' component from react-router-dom to navigate to pages and 'useSearchParams' hook to access URL search parameters
import { AlertCircle } from "lucide-react"; // import 'AlertCircle' icon from lucide-react
import { Button } from "@/components/ui/button"; // import 'Button' component from shadCN UI library

const SearchPage = () => { // define a functional component named 'SearchPage' that doesn't take any props
    const [searchParams] = useSearchParams(); // create an instance of 'useSearchParams' in an array since this hook returns an array
    
    const query = searchParams.get("query"); // extract value of 'query' parameter
    
    const [selectedCategories, setSelectedCatgories] = useState([]); // use 'useState' hook to create a state variable 'selectedCategories' with empty array as initial value and 'setSelectedCategories' function to modify this array
    
    const [sortByPrice, setSortByPrice] = useState(""); // use 'useState' hook to create a state variable 'sortByPrice' with empty string as initial value and 'setSortByPrice' function to modify this string

    const { data, isLoading } = useGetSearchCourseQuery({
        searchQuery: query,
        categories: selectedCategories,
        sortByPrice
    });

    const isEmpty = !isLoading && data?.courses.length === 0; // create a variable 'isEmpty' that will be true if 'isLoading' is false and 'courses' array in 'data' object is empty

    const handleFilterChange = (categories, price) => { // create a function named 'handleFilterChange' that takes 'categories' and 'price' as arguments
        setSelectedCatgories(categories); // update value of 'selectedCategories' to 'categories'
        setSortByPrice(price); // update value of 'sortByPrice' to 'price'
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="my-6">
                <h1 className="font-bold text-xl md:text-2xl">
                    result for "{query}"
                </h1>
                <p>
                    Showing results for{" "}
                    <span className="text-blue-800 font-bold italic">{query}</span>
                </p>
            </div>
            <div className="flex flex-col md:flex-row gap-10">
                <Filter handleFilterChange={handleFilterChange} />
                <div className="flex-1">
                    {isLoading ? ( // if value of 'isLoading' is true
                        Array.from({ length: 3 }).map((_, idx) => ( // then create an array of 3 undefined elements, and iterate through them to render 'CourseSkeleton' for each
                            <CourseSkeleton key={idx} />
                        ))
                    ) : isEmpty ? ( // if 'isLoading' is false but 'isEmpty' is true, render 'CourseNotFound' component
                        <CourseNotFound />
                    ) : (
                        data?.courses?.map((course) => ( // if 'isLoading' and 'isEmpty' are false, iterate over 'courses' array of 'data' object as 'course' and render 'SearchResult' for each
                            <SearchResult key={course._id} course={course} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;

const CourseNotFound = () => { // define a functional component named 'CourseNotFound' which doesn't take any props
    return (
        <div className="flex flex-col items-center justify-center min-h-32 dark:bg-gray-900 p-6">
            <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
            <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
                Course Not Found
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Sorry, we couldn't find the course you're looking for.
            </p>
            <Link to="/" className="italic">
                <Button variant="link">Browse All Courses</Button>
            </Link>
        </div>
    );
};

const CourseSkeleton = () => { // define a functional component named 'CourseSkeleton' which doesn't take any props
    return (
        <div className="flex-1 flex flex-col md:flex-row justify-between border-b border-gray-300 py-4">
            <div className="h-32 w-full md:w-64">
                <Skeleton className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col gap-2 flex-1 px-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="h-6 w-20 mt-2" />
            </div>

            <div className="flex flex-col items-end justify-between mt-4 md:mt-0">
                <Skeleton className="h-6 w-12" />
            </div>
        </div>
    );
};
