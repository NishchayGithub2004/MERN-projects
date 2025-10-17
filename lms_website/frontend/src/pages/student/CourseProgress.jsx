import { Badge } from "@/components/ui/badge"; // import Badge component to show completed lecture status
import { Button } from "@/components/ui/button"; // import Button component for marking course complete/incomplete
import { Card, CardContent, CardTitle } from "@/components/ui/card"; // import Card components to display lectures
import {
    useCompleteCourseMutation,
    useGetCourseProgressQuery,
    useInCompleteCourseMutation,
    useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi"; // import RTK query/mutation hooks for course progress
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react"; // import icons for course/lecture status
import React, { useEffect, useState } from "react"; // import React and hooks
import { useParams } from "react-router-dom"; // import hook to get route parameters
import { toast } from "sonner"; // import toast for success messages

const CourseProgress = () => { // define a function CourseProgress to display course lectures and track progress
    const params = useParams(); // get route parameters
    const courseId = params.courseId; // extract courseId from route

    const { data, isLoading, isError, refetch } =
        useGetCourseProgressQuery(courseId); // fetch course progress data using RTK query

    const [updateLectureProgress] = useUpdateLectureProgressMutation(); // mutation to update lecture progress

    const [
        completeCourse,
        { data: markCompleteData, isSuccess: completedSuccess },
    ] = useCompleteCourseMutation(); // mutation to mark course as complete

    const [
        inCompleteCourse,
        { data: markInCompleteData, isSuccess: inCompletedSuccess },
    ] = useInCompleteCourseMutation(); // mutation to mark course as incomplete

    useEffect(() => { // side-effect to handle toast messages when marking complete/incomplete
        console.log(markCompleteData); // log completion data for debugging

        if (completedSuccess) { // if course marked complete successfully
            refetch(); // refresh course progress data
            toast.success(markCompleteData.message); // show success toast
        }

        if (inCompletedSuccess) { // if course marked incomplete successfully
            refetch(); // refresh course progress data
            toast.success(markInCompleteData.message); // show success toast
        }
    }, [completedSuccess, inCompletedSuccess]); // run effect when success flags change

    const [currentLecture, setCurrentLecture] = useState(null); // state to track currently selected lecture

    if (isLoading) return <p>Loading...</p>; // show loading message while fetching data
    if (isError) return <p>Failed to load course details</p>; // show error message if fetch fails

    console.log(data); // log fetched course progress data

    const { courseDetails, progress, completed } = data.data; // destructure course details, progress array, and completed flag
    const { courseTitle } = courseDetails; // extract course title

    const initialLecture = currentLecture || (courseDetails.lectures && courseDetails.lectures[0]); // default to first lecture if none selected

    const isLectureCompleted = (lectureId) => { // define a function to check if a lecture is completed
        return progress.some((prog) => prog.lectureId === lectureId && prog.viewed); // check if lectureId exists in progress and viewed is true
    };

    const handleLectureProgress = async (lectureId) => { // define a function to update lecture progress
        await updateLectureProgress({ courseId, lectureId }); // call mutation to update progress
        refetch(); // refresh progress data
    };

    const handleSelectLecture = (lecture) => { // define a function to handle lecture selection
        setCurrentLecture(lecture); // update currentLecture state
        handleLectureProgress(lecture._id); // mark lecture as viewed
    };

    const handleCompleteCourse = async () => { // define a function to mark course complete
        await completeCourse(courseId); // call mutation
    };

    const handleInCompleteCourse = async () => { // define a function to mark course incomplete
        await inCompleteCourse(courseId); // call mutation
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            {/* Display course name and mark complete/incomplete button */}
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">{courseTitle}</h1> {/* display course title */}
                <Button
                    onClick={completed ? handleInCompleteCourse : handleCompleteCourse} // handle complete/incomplete based on status
                    variant={completed ? "outline" : "default"} // change button style based on status
                >
                    {completed ? (
                        <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" /> {/* completed icon */}
                            <span>Completed</span>
                        </div>
                    ) : (
                        "Mark as completed"
                    )}
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Video section */}
                <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
                    <div>
                        <video
                            src={currentLecture?.videoUrl || initialLecture.videoUrl} // play current or initial lecture video
                            controls
                            className="w-full h-auto md:rounded-lg"
                            onPlay={() =>
                                handleLectureProgress(currentLecture?._id || initialLecture._id) // update lecture progress on play
                            }
                        />
                    </div>
                    {/* Display current watching lecture title */}
                    <div className="mt-2">
                        <h3 className="font-medium text-lg">
                            {`Lecture ${courseDetails.lectures.findIndex(
                                (lec) =>
                                    lec._id === (currentLecture?._id || initialLecture._id)
                            ) + 1
                                } : ${currentLecture?.lectureTitle || initialLecture.lectureTitle
                                }`} {/* dynamically display lecture number and title */}
                        </h3>
                    </div>
                </div>

                {/* Lecture Sidebar */}
                <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
                    <h2 className="font-semibold text-xl mb-4">Course Lecture</h2> {/* section title */}
                    <div className="flex-1 overflow-y-auto">
                        {courseDetails?.lectures.map((lecture) => (
                            <Card
                                key={lecture._id}
                                className={`mb-3 hover:cursor-pointer transition transform ${lecture._id === currentLecture?._id
                                    ? "bg-gray-200 dark:dark:bg-gray-800"
                                    : ""
                                    } `}
                                onClick={() => handleSelectLecture(lecture)} // select lecture on click
                            >
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center">
                                        {isLectureCompleted(lecture._id) ? (
                                            <CheckCircle2 size={24} className="text-green-500 mr-2" /> // icon for completed lecture
                                        ) : (
                                            <CirclePlay size={24} className="text-gray-500 mr-2" /> // icon for incomplete lecture
                                        )}
                                        <div>
                                            <CardTitle className="text-lg font-medium">
                                                {lecture.lectureTitle} {/* display lecture title */}
                                            </CardTitle>
                                        </div>
                                    </div>
                                    {isLectureCompleted(lecture._id) && (
                                        <Badge
                                            variant={"outline"}
                                            className="bg-green-200 text-green-600"
                                        >
                                            Completed {/* show badge if lecture completed */}
                                        </Badge>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseProgress; // export CourseProgress component
