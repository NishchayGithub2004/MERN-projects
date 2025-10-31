import BuyCourseButton from "@/components/BuyCourseButton"; // import BuyCourseButton component to handle purchasing logic
import { Button } from "@/components/ui/button"; // import Button component from shadcn/ui for interactive actions
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // import Card components from shadcn/ui to organize course detail layout
import { Separator } from "@/components/ui/separator"; // import Separator component for visual division of sections
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi"; // import RTK Query hook to fetch course details and purchase status
import { BadgeInfo, Lock, PlayCircle } from "lucide-react"; // import icons from lucide-react for visual cues like info, lock, and play
import React from "react"; // import React library to create functional components
import ReactPlayer from "react-player"; // import ReactPlayer component for playing embedded course videos
import { useNavigate, useParams } from "react-router-dom"; // import hooks to extract route parameters and navigate programmatically

const CourseDetail = () => { // define a functional component named 'CourseDetail' to render detailed view of a course
    const params = useParams(); // retrieve URL parameters from current route
    
    const courseId = params.courseId; // extract courseId from route parameters
    
    const navigate = useNavigate(); // initialize navigation function for programmatic redirection
    
    const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId); // call query hook with courseId to get course info and status
    
    if (isLoading) return <h1>Loading...</h1>; // render loading message while fetching course data
    
    if (isError) return <h1>Failed to load course details</h1>; // render error message if API request fails

    const { course, purchased } = data; // destructure course object and purchased flag from API response

    const handleContinueCourse = () => { // define function to navigate to course progress page when course already purchased
        if (purchased) { // check if user has purchased the course
            navigate(`/course-progress/${courseId}`); // redirect to course progress page using courseId
        }
    };

    return (
        <div className="space-y-5"> {/* main container for course detail layout */}
            <div className="bg-[#2D2F31] text-white"> {/* section for course title and creator info with dark background */}
                <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2"> {/* content wrapper for course metadata */}
                    <h1 className="font-bold text-2xl md:text-3xl">
                        {course?.courseTitle} {/* render course title dynamically */}
                    </h1>
                    <p className="text-base md:text-lg">Course Sub-title</p> {/* static subtitle placeholder */}
                    <p>
                        Created By{" "}
                        <span className="text-[#C0C4FC] underline italic">
                            {course?.creator.name} {/* render course creator's name */}
                        </span>
                    </p>
                    <div className="flex items-center gap-2 text-sm"> {/* metadata row showing update info */}
                        <BadgeInfo size={16} /> {/* render info icon */}
                        <p>Last updated {course?.createdAt.split("T")[0]}</p> {/* show formatted course creation date */}
                    </div>
                    <p>Students enrolled: {course?.enrolledStudents.length}</p> {/* render number of students enrolled */}
                </div>
            </div>
            <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10"> {/* layout container for content and video section */}
                <div className="w-full lg:w-1/2 space-y-5"> {/* left section displaying course info and lectures */}
                    <h1 className="font-bold text-xl md:text-2xl">Description</h1> {/* description heading */}
                    <p
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: course.description }} // render HTML description directly from course data
                    />
                    <Card> {/* card container for lecture list */}
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle> {/* section title for lectures */}
                        </CardHeader>
                        <CardContent className="space-y-3"> {/* list container for lectures */}
                            {course.lectures.map((lecture, idx) => ( // iterate through lectures array
                                <div key={idx} className="flex items-center gap-3 text-sm">
                                    <span>
                                        {true ? <PlayCircle size={14} /> : <Lock size={14} />} {/* conditionally render play or lock icon based on lecture accessibility */}
                                    </span>
                                    <p>{lecture.lectureTitle}</p> {/* render lecture title text */}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <div className="w-full lg:w-1/3"> {/* right section showing video and purchase controls */}
                    <Card>
                        <CardContent className="p-4 flex flex-col"> {/* content container with padding and vertical alignment */}
                            <div className="w-full aspect-video mb-4"> {/* container maintaining video aspect ratio */}
                                <ReactPlayer
                                    width="100%" // set player width to full container width
                                    height={"100%"} // set player height to fill container height
                                    url={course.lectures[0].videoUrl} // load first lecture video URL as preview
                                    controls={true} // enable playback controls for user interaction
                                />
                            </div>
                            <h1>Lecture title</h1> {/* static placeholder for selected lecture title */}
                            <Separator className="my-2" /> {/* visual separator */}
                            <h1 className="text-lg md:text-xl font-semibold">Course Price</h1> {/* heading for course price section */}
                        </CardContent>
                        <CardFooter className="flex justify-center p-4"> {/* footer section for action buttons */}
                            {purchased ? ( // check if user already purchased the course
                                <Button 
                                    onClick={handleContinueCourse} // handle navigation to progress page on click
                                    className="w-full"
                                >
                                    Continue Course {/* display button label for continuing course */}
                                </Button>
                            ) : (
                                <BuyCourseButton courseId={courseId} /> // render BuyCourseButton component to initiate purchase
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail; // export CourseDetail component for route-level usage in course detail pages