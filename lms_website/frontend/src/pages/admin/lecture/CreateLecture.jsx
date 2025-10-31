import { Button } from "@/components/ui/button"; // import Button component to trigger navigation or actions
import { Input } from "@/components/ui/input"; // import Input component for user text input
import { Label } from "@/components/ui/label"; // import Label component to display field labels
import { useCreateLectureMutation, useGetCourseLectureQuery } from "@/features/api/courseApi"; // import API hooks to create and fetch lectures
import { Loader2 } from "lucide-react"; // import Loader2 icon to indicate loading state
import React, { useEffect, useState } from "react"; // import React and hooks for component state and lifecycle
import { useNavigate, useParams } from "react-router-dom"; // import navigation and URL parameter hooks
import { toast } from "sonner"; // import toast to display success/error notifications
import Lecture from "./Lecture"; // import Lecture component to render individual lecture items

const CreateLecture = () => { // define functional component CreateLecture to handle lecture creation and display
    const [lectureTitle, setLectureTitle] = useState(""); // declare lectureTitle state to store user input for lecture title

    const params = useParams(); // call useParams hook to access route parameters
    const courseId = params.courseId; // extract courseId parameter from URL for API use

    const navigate = useNavigate(); // call useNavigate to programmatically redirect user

    const [ // destructure return from useCreateLectureMutation hook to handle lecture creation API
        createLecture, // function to trigger lecture creation mutation
        { data, isLoading, isSuccess, error } // destructure mutation states: API response, loading, success, and error
    ] = useCreateLectureMutation();

    const { // call useGetCourseLectureQuery to fetch all lectures for given courseId
        data: lectureData, // store API response data as lectureData
        isLoading: lectureLoading, // store loading state as lectureLoading
        isError: lectureError, // store error flag as lectureError
        refetch, // function to refetch lecture data when needed
    } = useGetCourseLectureQuery(courseId);

    const createLectureHandler = async () => { // define function to handle new lecture creation
        await createLecture({ // trigger createLecture mutation
            lectureTitle, // send lectureTitle from state as payload
            courseId // send courseId from params to link lecture with its course
        });
    };

    useEffect(() => { // define side effect to handle lecture creation results
        if (isSuccess) { // check if lecture creation was successful
            refetch(); // refetch updated lecture list after successful creation
            toast.success(data.message); // display success message via toast
        }
        if (error) { // check if any error occurred during creation
            toast.error(error.data.message); // display error message via toast
        }
    }, [isSuccess, error]); // run effect when success or error state changes

    console.log(lectureData); // log lectureData object for debugging purpose

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
                        type="text" // set input type as text for title input
                        value={lectureTitle} // bind input value to lectureTitle state
                        onChange={(e) => setLectureTitle(e.target.value)} // update lectureTitle when user types
                        placeholder="Your Title Name" // placeholder text for input
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline" // set button variant as outline for secondary style
                        onClick={() => navigate(`/admin/course/${courseId}`)} // navigate back to course detail page
                    >
                        Back to course
                    </Button>
                    <Button 
                        disabled={isLoading} // disable button when API call is in progress
                        onClick={createLectureHandler} // call createLectureHandler when clicked
                    >
                        {isLoading ? ( // conditionally render spinner if loading
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
                    {lectureLoading ? ( // show loading message while fetching lectures
                        <p>Loading lectures...</p>
                    ) : lectureError ? ( // show error if lecture fetch fails
                        <p>Failed to load lectures.</p>
                    ) : lectureData.lectures.length === 0 ? ( // check if no lectures exist
                        <p>No lectures available</p>
                    ) : ( // render lectures when data exists
                        lectureData.lectures.map((lecture, index) => ( // iterate through lectures array
                            <Lecture
                                key={lecture._id} // assign unique key from lecture._id
                                lecture={lecture} // pass lecture data as prop
                                courseId={courseId} // pass courseId for related actions
                                index={index} // pass index for numbering or ordering
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateLecture; // export CreateLecture component for use in routing or parent component