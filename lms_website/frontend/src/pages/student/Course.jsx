import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // import avatar components from shadcn/ui to display course creator's profile image
import { Badge } from "@/components/ui/badge"; // import Badge component from shadcn/ui to show course difficulty level
import { Card, CardContent } from "@/components/ui/card"; // import Card and CardContent components from shadcn/ui to display course details within a styled card
import React from "react"; // import React to define functional component
import { Link } from "react-router-dom"; // import Link from react-router-dom to enable navigation to course detail page

const Course = ({ course }) => { // define a functional component named 'Course' to render a course preview card, taking 'course' as prop
    return (
        <Link
            to={`/course-detail/${course._id}`} // dynamically generate URL for navigating to the specific course detail page using its ID
        >
            <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"> {/* render card with hover effects and theme-based background */}
                <div className="relative"> {/* container for course thumbnail image */}
                    <img
                        src={course.courseThumbnail} // display thumbnail image for the course
                        alt="course" // provide alt text for accessibility
                        className="w-full h-36 object-cover rounded-t-lg" // style image to cover card width and maintain aspect ratio
                    />
                </div>
                <CardContent className="px-5 py-4 space-y-3"> {/* define inner content section of the card with padding and spacing */}
                    <h1 className="hover:underline font-bold text-lg truncate">
                        {course.courseTitle} {/* render course title text with underline on hover */}
                    </h1>
                    <div className="flex items-center justify-between"> {/* layout container to space creator info and course level */}
                        <div className="flex items-center gap-3"> {/* nested container for avatar and instructor name */}
                            <Avatar className="h-8 w-8"> {/* render circular avatar for instructor */}
                                <AvatarImage 
                                    src={course.creator?.photoUrl || "https://github.com/shadcn.png"} // display instructor's profile image or fallback placeholder
                                    alt="@shadcn" // accessibility text for avatar image
                                />
                                <AvatarFallback>CN</AvatarFallback> {/* fallback initials if image fails to load */}
                            </Avatar>
                            <h1 className="font-medium text-sm">
                                {course.creator?.name} {/* display course creator's name if available */}
                            </h1>
                        </div>
                        <Badge className={'bg-blue-600 text-white px-2 py-1 text-xs rounded-full'}>
                            {course.courseLevel} {/* render badge showing the course difficulty level */}
                        </Badge>
                    </div>
                    <div className="text-lg font-bold">
                        <span>₹{course.coursePrice}</span> {/* display formatted course price in Indian Rupees */}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default Course; // export Course component for use in course listing or grid displays