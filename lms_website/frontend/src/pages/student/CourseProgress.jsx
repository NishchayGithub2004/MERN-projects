import { Badge } from "@/components/ui/badge"; // import Badge component from shadcn/ui for displaying completion status
import { Button } from "@/components/ui/button"; // import Button component from shadcn/ui for clickable actions
import { Card, CardContent, CardTitle } from "@/components/ui/card"; // import Card components for structured lecture display
import { useCompleteCourseMutation, useGetCourseProgressQuery, useInCompleteCourseMutation, useUpdateLectureProgressMutation } from "@/features/api/courseProgressApi"; // import mutation and query hooks for managing course progress
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react"; // import icons for indicating play state and completion
import React, { useEffect, useState } from "react"; // import React, useEffect for side effects, and useState for local state management
import { useParams } from "react-router-dom"; // import hook to access route parameters
import { toast } from "sonner"; // import toast notification library for success messages

const CourseProgress = () => { // define functional component CourseProgress to manage and display course progress
    const params = useParams(); // extract parameters from route
    const courseId = params.courseId; // get courseId value from params

    const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId); // fetch course progress data using RTK query hook with courseId

    const [updateLectureProgress] = useUpdateLectureProgressMutation(); // create mutation function for updating lecture progress

    const [completeCourse, { data: markCompleteData, isSuccess: completedSuccess }] = useCompleteCourseMutation(); // create mutation function and destructure data and success flag for marking course as complete

    const [inCompleteCourse, { data: markInCompleteData, isSuccess: inCompletedSuccess }] = useInCompleteCourseMutation(); // create mutation function and destructure data and success flag for marking course as incomplete

    useEffect(() => { // use side effect to refetch and show notifications when completion status changes
        if (completedSuccess) { // check if course marked complete successfully
            refetch(); // refresh course data
            toast.success(markCompleteData.message); // show success message for course completion
        }
        if (inCompletedSuccess) { // check if course marked incomplete successfully
            refetch(); // refresh course data
            toast.success(markInCompleteData.message); // show success message for marking incomplete
        }
    }, [completedSuccess, inCompletedSuccess]); // run effect when either completion status changes

    const [currentLecture, setCurrentLecture] = useState(null); // maintain currently selected lecture in state

    if (isLoading) return <p>Loading...</p>; // display loading state while data fetch is in progress

    if (isError) return <p>Failed to load course details</p>; // display error message if data fetch fails

    const { courseDetails, progress, completed } = data.data; // destructure course details, progress, and completion status from response
    const { courseTitle } = courseDetails; // extract course title from course details
    const initialLecture = currentLecture || (courseDetails.lectures && courseDetails.lectures[0]); // determine which lecture to show by default

    const isLectureCompleted = (lectureId) => { // define function to check if a lecture is marked completed
        return progress.some((prog) => prog.lectureId === lectureId && prog.viewed); // check if lectureId exists in viewed progress array
    };

    const handleLectureProgress = async (lectureId) => { // define async function to update progress when lecture starts playing
        await updateLectureProgress({ courseId, lectureId }); // call mutation to mark lecture as viewed
        refetch(); // refresh progress data after update
    };

    const handleSelectLecture = (lecture) => { // define function to handle lecture selection from list
        setCurrentLecture(lecture); // update currentLecture state with selected lecture
        handleLectureProgress(lecture._id); // update progress for selected lecture
    };

    const handleCompleteCourse = async () => { // define async function to mark entire course as completed
        await completeCourse(courseId); // call mutation to complete course
    };

    const handleInCompleteCourse = async () => { // define async function to mark course as incomplete
        await inCompleteCourse(courseId); // call mutation to revert completion status
    };

    return (
        <div className="max-w-7xl mx-auto p-4"> {/* main container for course progress page */}
            <div className="flex justify-between mb-4"> {/* header section with title and complete button */}
                <h1 className="text-2xl font-bold">{courseTitle}</h1> {/* display dynamic course title */}
                <Button
                    onClick={completed ? handleInCompleteCourse : handleCompleteCourse} // toggle complete/incomplete status based on current completion state
                    variant={completed ? "outline" : "default"} // change button style accordingly
                >
                    {completed ? ( // conditionally render completed UI
                        <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" /> {/* render completion check icon */}
                            <span>Completed</span> {/* label showing completed status */}
                        </div>
                    ) : (
                        "Mark as completed" // button label for marking course as completed
                    )}
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6"> {/* layout for video player and lecture list */}
                <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4"> {/* left section for video display */}
                    <div>
                        <video
                            src={currentLecture?.videoUrl || initialLecture.videoUrl} // dynamically set video URL for selected or initial lecture
                            controls // enable default video controls
                            className="w-full h-auto md:rounded-lg"
                            onPlay={() =>
                                handleLectureProgress(currentLecture?._id || initialLecture._id) // mark lecture as viewed when video starts playing
                            }
                        />
                    </div>
                    <div className="mt-2"> {/* section showing lecture title below video */}
                        <h3 className="font-medium text-lg">
                            {`Lecture ${courseDetails.lectures.findIndex(
                                (lec) => lec._id === (currentLecture?._id || initialLecture._id)
                            ) + 1
                                } : ${currentLecture?.lectureTitle || initialLecture.lectureTitle}`} {/* render current lecture number and title */}
                        </h3>
                    </div>
                </div>

                <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0"> {/* right section for lecture list */}
                    <h2 className="font-semibold text-xl mb-4">Course Lecture</h2> {/* section heading */}
                    <div className="flex-1 overflow-y-auto"> {/* scrollable list container */}
                        {courseDetails?.lectures.map((lecture) => ( // map through lectures array to render each lecture card
                            <Card
                                key={lecture._id} // assign unique key for each lecture
                                className={`mb-3 hover:cursor-pointer transition transform ${lecture._id === currentLecture?._id ? "bg-gray-200 dark:bg-gray-800" : ""}`} // highlight selected lecture
                                onClick={() => handleSelectLecture(lecture)} // handle click to select and play lecture
                            >
                                <CardContent className="flex items-center justify-between p-4"> {/* layout for lecture item */}
                                    <div className="flex items-center">
                                        {isLectureCompleted(lecture._id) ? ( // check and render completed or not icon
                                            <CheckCircle2 size={24} className="text-green-500 mr-2" /> // completed lecture icon
                                        ) : (
                                            <CirclePlay size={24} className="text-gray-500 mr-2" /> // pending lecture icon
                                        )}
                                        <div>
                                            <CardTitle className="text-lg font-medium">
                                                {lecture.lectureTitle} {/* display lecture title */}
                                            </CardTitle>
                                        </div>
                                    </div>
                                    {isLectureCompleted(lecture._id) && ( // if lecture completed, show badge
                                        <Badge variant={"outline"} className="bg-green-200 text-green-600">
                                            Completed {/* text label inside badge */}
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

export default CourseProgress; // export CourseProgress component for use in routes or parent components