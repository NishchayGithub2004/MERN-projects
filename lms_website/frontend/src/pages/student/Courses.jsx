import { Skeleton } from "@/components/ui/skeleton"; // import Skeleton component for loading placeholders
import React from "react"; // import React for JSX support
import Course from "./Course"; // import Course component to display individual course cards
import { useGetPublishedCourseQuery } from "@/features/api/courseApi"; // import RTK query hook to fetch published courses

const Courses = () => { // define a function Courses to display all published courses
    const { data, isLoading, isError } = useGetPublishedCourseQuery(); // fetch published courses and track loading/error state

    if (isError) return <h1>Some error occurred while fetching courses.</h1> // show error message if fetching fails

    return (
        <div className="bg-gray-50 dark:bg-[#141414]">
            <div className="max-w-7xl mx-auto p-6">
                <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2> {/* display section title */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <CourseSkeleton key={index} /> // display skeleton placeholders while loading
                        ))
                    ) : (
                        data?.courses && data.courses.map((course, index) => (
                            <Course key={index} course={course} /> // render Course component for each published course
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Courses; // export Courses component for use in other parts of the app

const CourseSkeleton = () => { // define a function CourseSkeleton to show skeleton placeholder for course card
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
            <Skeleton className="w-full h-36" /> {/* skeleton for course thumbnail */}
            <div className="px-5 py-4 space-y-3">
                <Skeleton className="h-6 w-3/4" /> {/* skeleton for course title */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-6 rounded-full" /> {/* skeleton for creator avatar */}
                        <Skeleton className="h-4 w-20" /> {/* skeleton for creator name */}
                    </div>
                    <Skeleton className="h-4 w-16" /> {/* skeleton for course level or badge */}
                </div>
                <Skeleton className="h-4 w-1/4" /> {/* skeleton for course price */}
            </div>
        </div>
    );
};
