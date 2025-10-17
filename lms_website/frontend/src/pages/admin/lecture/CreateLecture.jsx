import { Button } from "@/components/ui/button"; // import Button component for clickable actions
import { Input } from "@/components/ui/input"; // import Input component for text fields
import { Label } from "@/components/ui/label"; // import Label component for form labeling
import { useCreateLectureMutation, useGetCourseLectureQuery } from "@/features/api/courseApi"; // import API hooks for creating and fetching lectures
import { Loader2 } from "lucide-react"; // import Loader2 icon for loading indication
import React, { useEffect, useState } from "react"; // import React and hooks for state and side effects
import { useNavigate, useParams } from "react-router-dom"; // import hooks for navigation and route parameters
import { toast } from "sonner"; // import toast for success/error notifications
import Lecture from "./Lecture"; // import Lecture component for rendering individual lectures

const CreateLecture = () => { // define a function component CreateLecture with no arguments
    const [lectureTitle, setLectureTitle] = useState(""); // create state variable lectureTitle with setter to store input lecture title

    const params = useParams(); // call useParams to access URL parameters
    const courseId = params.courseId; // extract courseId from params for API requests

    const navigate = useNavigate(); // call useNavigate to get navigation function

    const [
        createLecture, // mutation trigger function for creating lecture
        { data, isLoading, isSuccess, error } // destructure mutation state values from hook
    ] = useCreateLectureMutation(); // call custom mutation hook for creating lectures

    const {
        data: lectureData, // rename response data as lectureData
        isLoading: lectureLoading, // rename isLoading to lectureLoading for clarity
        isError: lectureError, // rename isError to lectureError for clarity
        refetch, // function to refetch lecture data after creation
    } = useGetCourseLectureQuery(courseId); // call query hook with courseId to fetch lectures of a specific course

    const createLectureHandler = async () => { // define a function createLectureHandler to trigger lecture creation
        await createLecture({ // call createLecture mutation function
            lectureTitle, // pass lectureTitle from state
            courseId // pass courseId from URL params
        });
    };

    useEffect(() => { // define a side effect to handle lecture creation response
        if (isSuccess) { // check if creation was successful
            refetch(); // refetch updated lecture list
            toast.success(data.message); // show success message using returned data
        }
        
        if (error) { // check if error occurred
            toast.error(error.data.message); // show error message from error object
        }
    }, [isSuccess, error]); // run effect when success or error changes

    console.log(lectureData); // log lectureData for debugging purposes

    return (
        <div className="flex-1 mx-10">
            <div className="mb-4">
                <h1 className="font-bold text-xl">
                    Let's add lectures, add some basic details for your new lecture
                </h1>
                <p className="text-sm">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus,
                    laborum!
                </p>
            </div>
            <div className="space-y-4">
                <div>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        value={lectureTitle} // bind input value to lectureTitle state
                        onChange={(e) => setLectureTitle(e.target.value)} // update state on input change using event target value
                        placeholder="Your Title Name"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline" // style button with outline variant
                        onClick={() => navigate(`/admin/course/${courseId}`)} // navigate back to course page using courseId
                    >
                        Back to course
                    </Button>
                    <Button 
                        disabled={isLoading} // disable button while lecture is being created
                        onClick={createLectureHandler} // call createLectureHandler when button clicked
                    >
                        {isLoading ? ( // conditionally render button content based on loading state
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                Please wait
                            </>
                        ) : (
                            "Create lecture"
                        )}
                    </Button>
                </div>
                <div className="mt-10">
                    {lectureLoading ? ( // show loading text while lectures are being fetched
                        <p>Loading lectures...</p>
                    ) : lectureError ? ( // show error message if lecture fetch failed
                        <p>Failed to load lectures.</p>
                    ) : lectureData.lectures.length === 0 ? ( // check if no lectures exist
                        <p>No lectures availabe</p>
                    ) : ( // otherwise, map over lectures and render Lecture components
                        lectureData.lectures.map((lecture, index) => (
                            <Lecture
                                key={lecture._id} // unique key for React rendering
                                lecture={lecture} // pass lecture data as prop
                                courseId={courseId} // pass courseId as prop
                                index={index} // pass index for ordering
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateLecture;
