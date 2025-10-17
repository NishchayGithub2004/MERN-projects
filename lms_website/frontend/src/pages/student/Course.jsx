import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // import avatar components to display user images with fallback
import { Badge } from "@/components/ui/badge"; // import Badge component to show course level
import { Card, CardContent } from "@/components/ui/card"; // import Card components to structure course information
import React from "react"; // import React for JSX support
import { Link } from "react-router-dom"; // import Link to navigate to course detail page

const Course = ({ course }) => { // define a function Course to render a single course card, takes 'course' object as prop
    return (
        <Link 
            to={`/course-detail/${course._id}`} // set dynamic route to course detail page using course._id
        >
            <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="relative">
                    <img
                        src={course.courseThumbnail} 
                        alt="course"
                        className="w-full h-36 object-cover rounded-t-lg"
                    />
                </div>
                <CardContent className="px-5 py-4 space-y-3">
                    <h1 className="hover:underline font-bold text-lg truncate">
                        {course.courseTitle} {/* display course title with bold font, truncation for overflow, and hover underline */}
                    </h1>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage 
                                    src={course.creator?.photoUrl || "https://github.com/shadcn.png"} 
                                    alt="@shadcn" 
                                /> {/* use creator photo if available, fallback to default image */}
                                <AvatarFallback>CN</AvatarFallback> {/* show initials if image fails to load */}
                            </Avatar>
                            <h1 className="font-medium text-sm">
                                {course.creator?.name} {/* display creator's name if available */}
                            </h1>
                        </div>
                        <Badge className={'bg-blue-600 text-white px-2 py-1 text-xs rounded-full'}>
                            {course.courseLevel} {/* display course difficulty level inside Badge */}
                        </Badge>
                    </div>
                    <div className="text-lg font-bold">
                        <span>₹{course.coursePrice}</span> {/* display course price in Indian Rupees */}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default Course; // export Course component for use in other parts of the app