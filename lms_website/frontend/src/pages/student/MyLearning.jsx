import React from "react"; // import React for JSX support
import Course from "./Course"; // import Course component to display individual courses
import { useLoadUserQuery } from "@/features/api/authApi"; // import RTK query hook to fetch user data

const MyLearning = () => { // define a function MyLearning to show courses the user is enrolled in
    const { data, isLoading } = useLoadUserQuery(); // fetch user data and track loading state

    const myLearning = data?.user.enrolledCourses || []; // extract user's enrolled courses or default to empty array

    return (
        <div className="max-w-4xl mx-auto my-10 px-4 md:px-0">
            <h1 className="font-bold text-2xl">MY LEARNING</h1> {/* section title */}
            <div className="my-5">
                {isLoading ? (
                    <MyLearningSkeleton /> // show skeleton loader while data is loading
                ) : myLearning.length === 0 ? (
                    <p>You are not enrolled in any course.</p> // message when no courses are enrolled
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {myLearning.map((course, index) => (
                            <Course key={index} course={course} /> // render Course component for each enrolled course
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLearning; // export MyLearning component for use in other parts of the app

const MyLearningSkeleton = () => ( // define a function MyLearningSkeleton to show loading placeholders
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
            <div
                key={index}
                className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
            >
                {/* placeholder skeleton block */}
            </div>
        ))}
    </div>
);
