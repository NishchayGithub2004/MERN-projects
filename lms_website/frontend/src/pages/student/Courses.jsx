import { Skeleton } from "@/components/ui/skeleton"; // import Skeleton component from shadcn/ui to display loading placeholders
import React from "react"; // import React to define components
import Course from "./Course"; // import Course component to display each individual course card
import { useGetPublishedCourseQuery } from "@/features/api/courseApi"; // import hook for fetching published courses from API

const Courses = () => { // define functional component Courses to render all available courses
    const { data, isLoading, isError } = useGetPublishedCourseQuery(); // call query hook and destructure data, loading, and error states

    if (isError) return <h1>Some error occurred while fetching courses.</h1>; // display error message if API request fails

    return (
        <div className="bg-gray-50 dark:bg-[#141414]"> {/* main wrapper with theme-based background */}
            <div className="max-w-7xl mx-auto p-6"> {/* center content and apply padding */}
                <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2> {/* heading for courses section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> {/* responsive grid for courses */}
                    {isLoading ? ( // check if courses are currently loading
                        Array.from({ length: 8 }).map((_, index) => ( // generate 8 skeleton placeholders to simulate loading courses
                            <CourseSkeleton key={index} /> // render CourseSkeleton component with unique key
                        ))
                    ) : (
                        data?.courses && data.courses.map((course, index) => ( // when data is loaded, map over courses array
                            <Course key={index} course={course} /> // render Course component passing current course as prop
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Courses; // export Courses component for use in other parts of app

const CourseSkeleton = () => { // define functional component CourseSkeleton to show skeleton loaders for courses
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden"> {/* skeleton card container with hover effect */}
            <Skeleton className="w-full h-36" /> {/* placeholder for course image */}
            <div className="px-5 py-4 space-y-3"> {/* skeleton body with spacing */}
                <Skeleton className="h-6 w-3/4" /> {/* placeholder for course title */}
                <div className="flex items-center justify-between"> {/* layout for instructor and badge placeholders */}
                    <div className="flex items-center gap-3"> {/* nested flex for avatar and name */}
                        <Skeleton className="h-6 w-6 rounded-full" /> {/* circular skeleton for instructor avatar */}
                        <Skeleton className="h-4 w-20" /> {/* skeleton for instructor name */}
                    </div>
                    <Skeleton className="h-4 w-16" /> {/* skeleton for badge or level */}
                </div>
                <Skeleton className="h-4 w-1/4" /> {/* skeleton for course price */}
            </div>
        </div>
    );
};