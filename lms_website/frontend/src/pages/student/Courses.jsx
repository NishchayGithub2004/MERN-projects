import { Skeleton } from "@/components/ui/skeleton"; // import 'Skeleton' component from shadCN UI library
import React from "react";
import Course from "./Course"; // import 'Course' component
import { useGetPublishedCourseQuery } from "@/features/api/courseApi"; // import 'useGetPublishedCourseQuery' hook to manage course related states

const Courses = () => { // define a functional components named 'Courses' that doesn't take any props
    const { data, isLoading, isError } = useGetPublishedCourseQuery(); // extract these things from 'useGetPublishedCourseQuery' hook

    if (isError) return <h1>Some error occurred while fetching courses.</h1> // if 'isError' is true, then render this heading

    return (
        <div className="bg-gray-50 dark:bg-[#141414]">
            <div className="max-w-7xl mx-auto p-6">
                <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? ( // if value of 'isLoading' is true
                        Array.from({ length: 8 }).map((_, index) => ( // create an array of 8 undefined values and iterate over each
                            <CourseSkeleton key={index} />
                        ))
                    ) : (
                        data?.courses && data.courses.map((course, index) => ( // if 'isLoading' is false, then if 'courses' property of 'data' object is not null, then iterate over 'courses' array as 'course' with 'index' as unique identifier
                            <Course key={index} course={course} /> // render 'Course' component with current element of array as prop
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Courses;

const CourseSkeleton = () => { // create a functional component named 'CourseSkeleton' that doesn't take any props
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
            <Skeleton className="w-full h-36" />
            <div className="px-5 py-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-1/4" />
            </div>
        </div>
    );
};
