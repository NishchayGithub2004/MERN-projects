import { Badge } from "@/components/ui/badge"; // import 'Badge' component from shadCN UI library
import { Button } from "@/components/ui/button"; // import 'Button' component from shadCN UI library
import { Card, CardContent, CardTitle } from "@/components/ui/card"; // import these card related components from shadCN UI library
import { useCompleteCourseMutation, useGetCourseProgressQuery, useInCompleteCourseMutation, useUpdateLectureProgressMutation } from "@/features/api/courseProgressApi"; // import these hooks to manage course progress related states
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react"; // import these icons from lucide-react library
import React, { useEffect, useState } from "react"; // import 'useEffect' hook to run side effects and 'useState' hook to manage states
import { useParams } from "react-router-dom"; // import 'useParams' hook from react-router-dom library to access URL parameters
import { toast } from "sonner"; // import toast to make pop-up messages

const CourseProgress = () => { // define a functional component named 'CourseProgress' that doesn't take any props
    const params = useParams(); // create an instance of 'useParams' to access URL parameters
    const courseId = params.courseId; // extract 'courseId' from URL parameter

    const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId); // extract these things from 'useGetCourseProgressQuery' with 'courseId' as argument

    const [updateLectureProgress] = useUpdateLectureProgressMutation(); // create an array intance of 'useUpdateLectureProgressMutation' hook

    const [
        completeCourse,
        { data: markCompleteData, isSuccess: completedSuccess },
    ] = useCompleteCourseMutation(); // extract 'completeCourse', 'markCompleteData' as 'data' and 'completedSuccess' as 'isSuccess' from 'useCompleteCourseMutation' hook

    const [
        inCompleteCourse,
        { data: markInCompleteData, isSuccess: inCompletedSuccess },
    ] = useInCompleteCourseMutation(); // extract 'icCompleteCourse', 'markInCompleteData' as 'data' and 'inCompletedSuccess' as 'isSuccess' from 'useInCompleteCourseMutation' hook

    useEffect(() => { // use 'useEffect' hook to run side-effects
        if (completedSuccess) { // if 'completedSuccess' is true
            refetch(); // call 'refetch' function
            toast.success(markCompleteData.message); // show toast message
        }

        if (inCompletedSuccess) { // if 'inCompletedSuccess' is true
            refetch(); // call 'refetch' function
            toast.success(markInCompleteData.message); // show toast message
        }
    }, [completedSuccess, inCompletedSuccess]); // run effect when value of 'completedSuccess' or 'inCompletedSuccess' changes by writing them both in dependency array

    const [currentLecture, setCurrentLecture] = useState(null); // state to track currently selected lecture

    if (isLoading) return <p>Loading...</p>; // show loading message while fetching data
    
    if (isError) return <p>Failed to load course details</p>; // show error message if fetch fails

    const { courseDetails, progress, completed } = data.data; // extract these things from 'data' property of 'data' object
    
    const { courseTitle } = courseDetails; // extract 'courseTitle' from 'courseDetails'

    const initialLecture = currentLecture || (courseDetails.lectures && courseDetails.lectures[0]);

    const isLectureCompleted = (lectureId) => { // define a function named 'isLectureCompleted' that takes 'lectureId' as argument
        // this function checks if lecture with ID 'lectureId' has been completed or not
        return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
    };

    const handleLectureProgress = async (lectureId) => { // define an async function named 'handleLectureProgress' that takes 'lectureId' as argument
        await updateLectureProgress({ courseId, lectureId }); // call 'updateLectureProgress' and give 'courseId' and 'lectureId' as argument to it
        refetch(); // call 'refetch' function
    };

    const handleSelectLecture = (lecture) => { // define a function named 'handleSelecLecture' that takes 'lecture' as argument
        setCurrentLecture(lecture); // call 'setCurrentLecture' for 'lecture' as argument
        handleLectureProgress(lecture._id); // call 'handleLectureProgress' for '_id' value of 'lecture' object as argument
    };

    const handleCompleteCourse = async () => { // define an async function named 'handleCompleteCourse' to handle complete courses
        await completeCourse(courseId); // call 'completeCourse' function with 'courseId' as argument
    };

    const handleInCompleteCourse = async () => { // define an async function named 'handleInCompleteCourse' to handle incomplete courses
        await inCompleteCourse(courseId); // call 'inCompleteCourse' function with 'courseId' as argument
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">{courseTitle}</h1> {/* display course title */}
                <Button
                    onClick={completed ? handleInCompleteCourse : handleCompleteCourse} // if value of 'completed' is true, call 'handleInCompleteCourse' function when this button is clicked, otherwise call 'handleCompleteCourse' function
                    variant={completed ? "outline" : "default"}
                >
                    {completed ? (
                        <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <span>Completed</span>
                        </div>
                    ) : (
                        "Mark as completed"
                    )}
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
                    <div>
                        <video
                            src={currentLecture?.videoUrl || initialLecture.videoUrl} 
                            controls
                            className="w-full h-auto md:rounded-lg"
                            onPlay={() =>
                                handleLectureProgress(currentLecture?._id || initialLecture._id) // when the video is played, call 'handleLectureProgress' for unique ID of 'currentLecture' object if it is available, otherwise for 'initialLecture' object
                            }
                        />
                    </div>
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
                <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
                    <h2 className="font-semibold text-xl mb-4">Course Lecture</h2> {/* section title */}
                    <div className="flex-1 overflow-y-auto">
                        {courseDetails?.lectures.map((lecture) => ( // iterate over 'lectures' array of 'courseDetails' object as 'lecture'
                            <Card
                                key={lecture._id}
                                className={`mb-3 hover:cursor-pointer transition transform ${lecture._id === currentLecture?._id // allot button color only if value of '_id' property of 'lecture' object is the same as that of 'currentLecture'
                                    ? "bg-gray-200 dark:dark:bg-gray-800"
                                    : ""
                                    } `}
                                onClick={() => handleSelectLecture(lecture)} // clicking this card calls 'handleSelectLecture' function for 'lecture' as argument
                            >
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center">
                                        {isLectureCompleted(lecture._id) ? ( // if calling 'isLectureCompleted' function for unique ID of 'lecture' object returns true, then render first icon, otherwise render second
                                            <CheckCircle2 size={24} className="text-green-500 mr-2" />
                                        ) : (
                                            <CirclePlay size={24} className="text-gray-500 mr-2" /
                                        )}
                                        <div>
                                            <CardTitle className="text-lg font-medium">
                                                {lecture.lectureTitle} {/* display lecture title */}
                                            </CardTitle>
                                        </div>
                                    </div>
                                    {isLectureCompleted(lecture._id) && ( // if calling 'isLectureCompleted' function for unique ID of 'lecture' object returns true, then render the following content
                                        <Badge
                                            variant={"outline"}
                                            className="bg-green-200 text-green-600"
                                        >
                                            Completed
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

export default CourseProgress;
