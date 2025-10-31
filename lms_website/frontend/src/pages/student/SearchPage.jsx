import React, { useState } from "react"; // import React and useState hook to manage local component state
import Filter from "./Filter"; // import Filter component for category and price filters
import SearchResult from "./SearchResult"; // import SearchResult component to display search results
import { Skeleton } from "@/components/ui/skeleton"; // import Skeleton component for loading placeholders
import { useGetSearchCourseQuery } from "@/features/api/courseApi"; // import hook to fetch search results from API
import { Link, useSearchParams } from "react-router-dom"; // import Link for navigation and useSearchParams to read query from URL
import { AlertCircle } from "lucide-react"; // import AlertCircle icon for error display
import { Button } from "@/components/ui/button"; // import Button component for navigation and actions

const SearchPage = () => { // define functional component SearchPage that renders search results page
    const [searchParams] = useSearchParams(); // get URL search parameters from the browser
    const query = searchParams.get("query"); // extract the 'query' parameter value from URL

    const [selectedCategories, setSelectedCatgories] = useState([]); // create state for selected categories filter with empty array as initial value
    const [sortByPrice, setSortByPrice] = useState(""); // create state for sorting courses by price

    const { data, isLoading } = useGetSearchCourseQuery({ // call API query hook with filter parameters
        searchQuery: query, // send current search text
        categories: selectedCategories, // send selected categories
        sortByPrice // send sorting preference
    });

    const isEmpty = !isLoading && data?.courses.length === 0; // check if data is fetched and no courses are found

    const handleFilterChange = (categories, price) => { // handle category or price filter changes
        setSelectedCatgories(categories); // update selected categories state
        setSortByPrice(price); // update sortByPrice state
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8"> {/* main layout container */}
            <div className="my-6">
                <h1 className="font-bold text-xl md:text-2xl">
                    result for "{query}" {/* show search query text */}
                </h1>
                <p>
                    Showing results for{" "}
                    <span className="text-blue-800 font-bold italic">{query}</span> {/* highlight search term */}
                </p>
            </div>
            <div className="flex flex-col md:flex-row gap-10"> {/* flex layout for filter and results */}
                <Filter handleFilterChange={handleFilterChange} /> {/* render Filter with callback to update filters */}
                <div className="flex-1"> {/* main section for showing results */}
                    {isLoading ? ( // show skeletons while loading
                        Array.from({ length: 3 }).map((_, idx) => ( // create 3 skeleton placeholders
                            <CourseSkeleton key={idx} /> // render CourseSkeleton for each
                        ))
                    ) : isEmpty ? ( // if no courses found after loading
                        <CourseNotFound /> // show CourseNotFound component
                    ) : (
                        data?.courses?.map((course) => ( // iterate over fetched courses
                            <SearchResult key={course._id} course={course} /> // render SearchResult for each course
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage; // export SearchPage for use in routing or parent components

const CourseNotFound = () => { // define component to display message when no course found
    return (
        <div className="flex flex-col items-center justify-center min-h-32 dark:bg-gray-900 p-6"> {/* centered layout for message */}
            <AlertCircle className="text-red-500 h-16 w-16 mb-4" /> {/* warning icon */}
            <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
                Course Not Found {/* main message heading */}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Sorry, we couldn't find the course you're looking for. {/* explanation text */}
            </p>
            <Link to="/" className="italic"> {/* navigation link to homepage */}
                <Button variant="link">Browse All Courses</Button> {/* button to return to all courses */}
            </Link>
        </div>
    );
};

const CourseSkeleton = () => { // define skeleton component to display placeholder while data is loading
    return (
        <div className="flex-1 flex flex-col md:flex-row justify-between border-b border-gray-300 py-4"> {/* container for skeleton item */}
            <div className="h-32 w-full md:w-64"> {/* placeholder for image */}
                <Skeleton className="h-full w-full object-cover" /> {/* skeleton for course image */}
            </div>
            <div className="flex flex-col gap-2 flex-1 px-4"> {/* placeholder for course info */}
                <Skeleton className="h-6 w-3/4" /> {/* title placeholder */}
                <Skeleton className="h-4 w-1/2" /> {/* description placeholder */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-1/3" /> {/* additional info placeholder */}
                </div>
                <Skeleton className="h-6 w-20 mt-2" /> {/* button placeholder */}
            </div>
            <div className="flex flex-col items-end justify-between mt-4 md:mt-0"> {/* price or rating placeholder */}
                <Skeleton className="h-6 w-12" /> {/* final placeholder */}
            </div>
        </div>
    );
};