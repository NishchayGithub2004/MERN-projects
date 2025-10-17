import { Badge } from "@/components/ui/badge"; // import Badge component for course level display
import React from "react"; // import React for JSX support
import { Link } from "react-router-dom"; // import Link component for navigation to course detail page

const SearchResult = ({ course }) => { // define a function SearchResult to display individual search result course card

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 py-4 gap-4">
            <Link
                to={`/course-detail/${course._id}`} // link to course detail page using course ID
                className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
            >
                <img
                    src={course.courseThumbnail} // course thumbnail image
                    alt="course-thumbnial" // alt text for accessibility
                    className="h-32 w-full md:w-56 object-cover rounded" // styling for image
                />
                <div className="flex flex-col gap-2">
                    <h1 className="font-bold text-lg md:text-xl">{course.courseTitle}</h1> {/* course title */}
                    <p className="text-sm text-gray-600">{course.subTitle}</p> {/* course subtitle */}
                    <p className="text-sm text-gray-700">
                        Intructor: <span className="font-bold">{course.creator?.name}</span> {/* course creator */}
                    </p>
                    <Badge className="w-fit mt-2 md:mt-0">{course.courseLevel}</Badge> {/* course level badge */}
                </div>
            </Link>
            <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto">
                <h1 className="font-bold text-lg md:text-xl">₹{course.coursePrice}</h1> {/* course price */}
            </div>
        </div>
    );
};

export default SearchResult; // export SearchResult component for use in search results page
