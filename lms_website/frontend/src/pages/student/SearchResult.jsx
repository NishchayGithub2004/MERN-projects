import { Badge } from "@/components/ui/badge"; // import Badge component from shadCN UI library for displaying course level
import React from "react";
import { Link } from "react-router-dom"; // import Link component for navigation between course detail pages

const SearchResult = ({ course }) => { // define functional component SearchResult to render individual search result card, taking 'course' as prop
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 py-4 gap-4"> {/* container for course item layout */}
            <Link
                to={`/course-detail/${course._id}`} // navigate to detailed course page using course id
                className="flex flex-col md:flex-row gap-4 w-full md:w-auto" // responsive layout for image and text content
            >
                <img
                    src={course.courseThumbnail} // display course thumbnail image
                    alt="course-thumbnail" // provide alternate text for image
                    className="h-32 w-full md:w-56 object-cover rounded" // style image for responsiveness and rounded edges
                />
                <div className="flex flex-col gap-2"> {/* container for course details */}
                    <h1 className="font-bold text-lg md:text-xl">{course.courseTitle}</h1> {/* display course title */}
                    <p className="text-sm text-gray-600">{course.subTitle}</p> {/* display short subtitle or description */}
                    <p className="text-sm text-gray-700">
                        Instructor: <span className="font-bold">{course.creator?.name}</span> {/* display instructor name */}
                    </p>
                    <Badge className="w-fit mt-2 md:mt-0">{course.courseLevel}</Badge> {/* show course level inside a badge */}
                </div>
            </Link>
            <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto"> {/* container for price info */}
                <h1 className="font-bold text-lg md:text-xl">₹{course.coursePrice}</h1> {/* display course price */}
            </div>
        </div>
    );
};

export default SearchResult; // export SearchResult component for use in search results list