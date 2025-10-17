import BuyCourseButton from "@/components/BuyCourseButton"; // import custom button component to buy course
import { Button } from "@/components/ui/button"; // import Button component for actions like continue course
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card"; // import Card components to structure course content
import { Separator } from "@/components/ui/separator"; // import Separator component to divide sections visually
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi"; // import RTK query hook to fetch course details with purchase status
import { BadgeInfo, Lock, PlayCircle } from "lucide-react"; // import icons for course info, locked lectures, and play button
import React from "react"; // import React for JSX support
import ReactPlayer from "react-player"; // import ReactPlayer for embedding course videos
import { useNavigate, useParams } from "react-router-dom"; // import hooks for route params and navigation

const CourseDetail = () => { // define a function CourseDetail to render course information and content
    const params = useParams(); // get route parameters from URL
    const courseId = params.courseId; // extract courseId from params
    const navigate = useNavigate(); // initialize navigate function for programmatic navigation
    const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId); // fetch course details and purchase status using RTK query

    if (isLoading) return <h1>Loading...</h1>; // show loading message while data is being fetched
    if (isError) return <h>Failed to load course details</h>; // show error message if fetching fails

    const { course, purchased } = data; // destructure course details and purchase status from fetched data
    console.log(purchased); // log purchase status for debugging

    const handleContinueCourse = () => { // define a function to handle continuing the course
        if (purchased) { // check if the course is purchased
            navigate(`/course-progress/${courseId}`) // navigate to course progress page
        }
    }

    return (
        <div className="space-y-5">
            <div className="bg-[#2D2F31] text-white">
                <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
                    <h1 className="font-bold text-2xl md:text-3xl">
                        {course?.courseTitle} {/* display course title if available */}
                    </h1>
                    <p className="text-base md:text-lg">Course Sub-title</p> {/* placeholder subtitle */}
                    <p>
                        Created By{" "}
                        <span className="text-[#C0C4FC] underline italic">
                            {course?.creator.name} {/* display creator's name */}
                        </span>
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                        <BadgeInfo size={16} /> {/* show info icon for last updated date */}
                        <p>Last updated {course?.createdAt.split("T")[0]}</p> {/* format and display last updated date */}
                    </div>
                    <p>Students enrolled: {course?.enrolledStudents.length} {/* display number of enrolled students */}</p>
                </div>
            </div>
            <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
                <div className="w-full lg:w-1/2 space-y-5">
                    <h1 className="font-bold text-xl md:text-2xl">Description</h1>
                    <p
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: course.description }} // render course description as HTML
                    />
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle> {/* display course content section title */}
                            <CardDescription>4 lectures</CardDescription> {/* display total number of lectures */}
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {course.lectures.map((lecture, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm">
                                    <span>
                                        {true ? <PlayCircle size={14} /> : <Lock size={14} />} {/* show play icon if lecture accessible, lock icon if not */}
                                    </span>
                                    <p>{lecture.lectureTitle} {/* display lecture title */}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <div className="w-full lg:w-1/3">
                    <Card>
                        <CardContent className="p-4 flex flex-col">
                            <div className="w-full aspect-video mb-4">
                                <ReactPlayer
                                    width="100%" 
                                    height={"100%"} 
                                    url={course.lectures[0].videoUrl} // play first lecture video
                                    controls={true} // enable video controls
                                />
                            </div>
                            <h1>Lecture title</h1> {/* placeholder lecture title */}
                            <Separator className="my-2" /> {/* separate sections visually */}
                            <h1 className="text-lg md:text-xl font-semibold">Course Price</h1> {/* display course price section title */}
                        </CardContent>
                        <CardFooter className="flex justify-center p-4">
                            {purchased ? (
                                <Button 
                                    onClick={handleContinueCourse} 
                                    className="w-full"
                                >
                                    Continue Course {/* button to continue course if purchased */}
                                </Button>
                            ) : (
                                <BuyCourseButton courseId={courseId} /> // button to buy course if not purchased
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail; // export CourseDetail component for use in other parts of the app
