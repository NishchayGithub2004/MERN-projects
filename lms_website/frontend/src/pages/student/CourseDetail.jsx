import BuyCourseButton from "@/components/BuyCourseButton"; // import 'BuyCourseButton' component
import { Button } from "@/components/ui/button"; // import 'Button' component from shadCN UI library
import {  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // import these card related components from shadCN UI library
import { Separator } from "@/components/ui/separator"; // import Separator component to divide sections visually
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi"; // import 'useGetCourseDetailWithStatusQuery' hook to manage course purchase related states
import { BadgeInfo, Lock, PlayCircle } from "lucide-react"; // import these icons from lucide-react library
import React from "react";
import ReactPlayer from "react-player"; // import ReactPlayer for embedding course videos
import { useNavigate, useParams } from "react-router-dom"; // import hooks for route params and navigation

const CourseDetail = () => { // define a functional component named 'CourseDetail' that doesn't take any prop
    const params = useParams(); // create an instance of 'useParams' hook to extract URL routes and their values
    
    const courseId = params.courseId; // extract value of 'courseId' parameter from URL
    
    const navigate = useNavigate(); // create an instance of 'useNavigate' hook to navigate programmatically
    
    const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId); // extract these things from 'useGetCourseDetailWithStatusQuery' hook with 'courseId' as argument

    if (isLoading) return <h1>Loading...</h1>; // if 'isLoading' is true, return this heading
    
    if (isError) return <h1>Failed to load course details</h1>; // if 'isError' is true, return this heading

    const { course, purchased } = data; // extract 'course' and 'purchased' from 'data' object

    const handleContinueCourse = () => { // define a function named 'handeContinueCourse'
        if (purchased) { // if value of 'purchased' is true ie course is purchased
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
                    <p className="text-base md:text-lg">Course Sub-title</p>
                    <p>
                        Created By{" "}
                        <span className="text-[#C0C4FC] underline italic">
                            {course?.creator.name} {/* display creator's name */}
                        </span>
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                        <BadgeInfo size={16} />
                        <p>Last updated {course?.createdAt.split("T")[0]}</p>
                    </div>
                    <p>Students enrolled: {course?.enrolledStudents.length}</p> {/* display number of enrolled students */}
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
                            <CardTitle>Course Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {course.lectures.map((lecture, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm">
                                    <span>
                                        {true ? <PlayCircle size={14} /> : <Lock size={14} />} {/* show play icon if lecture accessible, lock icon if not */}
                                    </span>
                                    <p>{lecture.lectureTitle}</p> {/* display lecture title */}
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
                            <h1>Lecture title</h1>
                            <Separator className="my-2" />
                            <h1 className="text-lg md:text-xl font-semibold">Course Price</h1>
                        </CardContent>
                        <CardFooter className="flex justify-center p-4">
                            {purchased ? ( // if value of 'purchased' is true, render first content, otherwise, render second content
                                <Button 
                                    onClick={handleContinueCourse} 
                                    className="w-full"
                                >
                                    Continue Course
                                </Button>
                            ) : (
                                <BuyCourseButton courseId={courseId} />
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
