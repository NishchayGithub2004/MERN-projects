import React from "react";
import Course from "./Course"; // import 'Course' component
import { useLoadUserQuery } from "@/features/api/authApi"; // import 'useLoadUserQuery' hook to manage search query related states

const MyLearning = () => { // define a functional component named 'MyLearning' that doesn't take any props
    const { data, isLoading } = useLoadUserQuery(); // extract 'data' and 'isLoading' from 'useLoadUserQuery' hook

    const myLearning = data?.user.enrolledCourses || []; // create an array named 'myLearning' which is either 'enrolledCourses' array present in 'user' object present in 'data' object if 'data' object is not null, otherwise it is empty string

    return (
        <div className="max-w-4xl mx-auto my-10 px-4 md:px-0">
            <h1 className="font-bold text-2xl">MY LEARNING</h1>
            <div className="my-5">
                {isLoading ? ( // if value of 'isLoading' is true, render 'MyLearningSkeleton' component
                    <MyLearningSkeleton />
                ) : myLearning.length === 0 ? ( // if 'isLoading' is false and length of 'myLearning' is 0, render paragraph showing that user is not enrolled in any use
                    <p>You are not enrolled in any course.</p>
                ) : ( // if 'isLoading' is false and length of 'myLearning' is not 0, then iterate over 'myLearning' as 'course' and for each element in it, render 'Course' component
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {myLearning.map((course, index) => (
                            <Course key={index} course={course} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLearning;

const MyLearningSkeleton = () => ( // define a functional component named 'MyLearningSkeleton' that doesn't take any props
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => ( // create an empty array of 3 elements and iterate over it
            <div
                key={index}
                className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
            >
            </div>
        ))}
    </div>
);
