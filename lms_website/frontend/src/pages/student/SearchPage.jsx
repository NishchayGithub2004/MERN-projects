import React, { useState } from "react"; // import React and useState hook
import Filter from "./Filter"; // import Filter component for filtering courses
import SearchResult from "./SearchResult"; // import SearchResult component for displaying individual courses
import { Skeleton } from "@/components/ui/skeleton"; // import Skeleton component for loading placeholders
import { useGetSearchCourseQuery } from "@/features/api/courseApi"; // import RTK query hook for searching courses
import { Link, useSearchParams } from "react-router-dom"; // import Link and useSearchParams for navigation and query params
import { AlertCircle } from "lucide-react"; // import icon for "not found" message
import { Button } from "@/components/ui/button"; // import Button component

const SearchPage = () => { // define SearchPage component to show search results and filters
    const [searchParams] = useSearchParams(); // get URL search parameters
    const query = searchParams.get("query"); // extract "query" parameter
    const [selectedCategories, setSelectedCatgories] = useState([]); // state for selected filter categories
    const [sortByPrice, setSortByPrice] = useState(""); // state for sorting by price

    const { data, isLoading } = useGetSearchCourseQuery({ // fetch courses based on search query, categories, and price sort
        searchQuery: query,
        categories: selectedCategories,
        sortByPrice
    });

    const isEmpty = !isLoading && data?.courses.length === 0; // check if there are no courses found

    const handleFilterChange = (categories, price) => { // handle filter changes from Filter component
        setSelectedCatgories(categories); // update selected categories state
        setSortByPrice(price); // update sort by price state
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="my-6">
                <h1 className="font-bold text-xl md:text-2xl">
                    result for "{query}"
                </h1> {/* show search query */}
                <p>
                    Showing results for{" "}
                    <span className="text-blue-800 font-bold italic">{query}</span> {/* highlight search query */}
                </p>
            </div>
            <div className="flex flex-col md:flex-row gap-10">
                <Filter handleFilterChange={handleFilterChange} /> {/* display filter sidebar */}
                <div className="flex-1">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, idx) => (
                            <CourseSkeleton key={idx} /> // show skeleton loaders while loading
                        ))
                    ) : isEmpty ? (
                        <CourseNotFound /> // show "not found" message if no courses
                    ) : (
                        data?.courses?.map((course) => (
                            <SearchResult key={course._id} course={course} /> // show search result course
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage; // export SearchPage component

const CourseNotFound = () => { // define component for "no courses found" message
    return (
        <div className="flex flex-col items-center justify-center min-h-32 dark:bg-gray-900 p-6">
            <AlertCircle className="text-red-500 h-16 w-16 mb-4" /> {/* not found icon */}
            <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
                Course Not Found
            </h1> {/* heading */}
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Sorry, we couldn't find the course you're looking for.
            </p> {/* description */}
            <Link to="/" className="italic">
                <Button variant="link">Browse All Courses</Button> {/* button to navigate to all courses */}
            </Link>
        </div>
    );
};

const CourseSkeleton = () => { // define skeleton loader for search results
    return (
        <div className="flex-1 flex flex-col md:flex-row justify-between border-b border-gray-300 py-4">
            <div className="h-32 w-full md:w-64">
                <Skeleton className="h-full w-full object-cover" /> {/* thumbnail placeholder */}
            </div>

            <div className="flex flex-col gap-2 flex-1 px-4">
                <Skeleton className="h-6 w-3/4" /> {/* title placeholder */}
                <Skeleton className="h-4 w-1/2" /> {/* subtitle placeholder */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-1/3" /> {/* instructor placeholder */}
                </div>
                <Skeleton className="h-6 w-20 mt-2" /> {/* price placeholder */}
            </div>

            <div className="flex flex-col items-end justify-between mt-4 md:mt-0">
                <Skeleton className="h-6 w-12" /> {/* badge placeholder */}
            </div>
        </div>
    );
};
