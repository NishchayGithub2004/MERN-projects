import React from "react"; // import React to enable component creation
import Course from "./Course"; // import Course component to display individual course cards
import { useLoadUserQuery } from "@/features/api/authApi"; // import useLoadUserQuery hook to fetch logged-in user data from the backend

const MyLearning = () => { // define functional component MyLearning representing the user's enrolled courses section
    const { data, isLoading } = useLoadUserQuery(); // call useLoadUserQuery to get user data and loading state
    const myLearning = data?.user.enrolledCourses || []; // safely extract enrolledCourses from user data, fallback to empty array if unavailable

    return (
        <div className="max-w-4xl mx-auto my-10 px-4 md:px-0"> {/* container with responsive padding and width */}
            <h1 className="font-bold text-2xl">MY LEARNING</h1> {/* section title */}
            <div className="my-5">
                {isLoading ? ( // conditionally render while data is being fetched
                    <MyLearningSkeleton /> // show skeleton loader if still loading
                ) : myLearning.length === 0 ? ( // check if user has no enrolled courses
                    <p>You are not enrolled in any course.</p> // display message when no courses found
                ) : ( // otherwise render the list of enrolled courses
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> {/* responsive grid layout */}
                        {myLearning.map((course, index) => ( // iterate through enrolled courses
                            <Course key={index} course={course} /> // render Course component for each course
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLearning; // export MyLearning component for external use

const MyLearningSkeleton = () => ( // define MyLearningSkeleton component to display loading placeholders
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> {/* responsive grid layout for placeholders */}
        {[...Array(3)].map((_, index) => ( // create array of 3 elements and map to display 3 skeleton boxes
            <div
                key={index} // assign unique key for each skeleton item
                className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse" // apply gray background and pulsing animation
            ></div>
        ))}
    </div>
);