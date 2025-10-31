import { Button } from "@/components/ui/button"; // import Button component to trigger user actions
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // import Card-related components to structure lecture editing UI
import { Input } from "@/components/ui/input"; // import Input component for entering text or file data
import { Label } from "@/components/ui/label"; // import Label component to describe inputs
import { Progress } from "@/components/ui/progress"; // import Progress component to show upload completion visually
import { Switch } from "@/components/ui/switch"; // import Switch component for toggling lecture's free access
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from "@/features/api/courseApi"; // import mutation and query hooks for editing, fetching, and deleting lecture data
import axios from "axios"; // import axios to make HTTP requests for uploading video files
import { Loader2 } from "lucide-react"; // import Loader2 icon to show loading spinner during async operations
import React, { useEffect, useState } from "react"; // import React library and its hooks for managing state and side effects
import { useParams } from "react-router-dom"; // import useParams hook to extract route parameters dynamically
import { toast } from "sonner"; // import toast for displaying success or error notifications

const MEDIA_API = "http://localhost:3000/api/v1/media"; // define constant for base media API endpoint

const LectureTab = () => { // define a functional component named 'LectureTab' to manage editing and removing a lecture
    const [lectureTitle, setLectureTitle] = useState(""); // create state variable lectureTitle to store current lecture name
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null); // create state variable uploadVideoInfo to hold uploaded video metadata
    const [isFree, setIsFree] = useState(false); // create state variable isFree to indicate if the lecture is free to preview
    const [mediaProgress, setMediaProgress] = useState(false); // create state variable mediaProgress to track if upload is in progress
    const [uploadProgress, setUploadProgress] = useState(0); // create state variable uploadProgress to track upload percentage
    const [btnDisable, setBtnDisable] = useState(true); // create state variable btnDisable to control whether action buttons are enabled

    const params = useParams(); // call useParams to extract route parameters
    const { courseId, lectureId } = params; // destructure courseId and lectureId from URL params for API usage

    const { data: lectureData } = useGetLectureByIdQuery(lectureId); // call query hook to fetch lecture by ID and rename data to lectureData
    const lecture = lectureData?.lecture; // safely extract lecture object from lectureData if available

    useEffect(() => { // run side effect when lecture data is fetched or updated
        if (lecture) { // check if lecture data exists
            setLectureTitle(lecture.lectureTitle); // update state with existing lecture title
            setIsFree(lecture.isPreviewFree); // update state with lecture free status
            setUploadVideoInfo(lecture.videoInfo); // update state with lecture's video information
        }
    }, [lecture]); // dependency array ensures effect runs only when lecture changes

    const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation(); // destructure mutation function and states from useEditLectureMutation hook
    const [removeLecture, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess }] = useRemoveLectureMutation(); // destructure mutation function and states from useRemoveLectureMutation hook

    const fileChangeHandler = async (e) => { // define an async function fileChangeHandler to handle video file uploads
        const file = e.target.files[0]; // access first file selected from input event
        if (file) { // check if a file is selected
            const formData = new FormData(); // create new FormData instance to send file data to server
            formData.append("file", file); // append selected file into formData with key 'file'
            setMediaProgress(true); // set mediaProgress true to show progress bar
            try { // execute upload request in try block
                const res = await axios.post( // send POST request to upload video to server
                    `${MEDIA_API}/upload-video`, // specify upload endpoint for video
                    formData, // include formData as request body
                    {
                        onUploadProgress: ({ loaded, total }) => { // track upload progress during transmission
                            setUploadProgress(Math.round((loaded * 100) / total)); // update uploadProgress state with percentage completed
                        },
                    }
                );
                if (res.data.success) { // check if upload succeeded
                    setUploadVideoInfo({ // update video information state with server response
                        videoUrl: res.data.data.url, // store uploaded video's URL
                        publicId: res.data.data.public_id, // store uploaded video's public identifier
                    });
                    setBtnDisable(false); // enable buttons after upload success
                    toast.success(res.data.message); // display success notification with returned message
                }
            } catch (error) { // handle any upload failure
                toast.error("video upload failed"); // show generic error message for failed upload
            } finally { // always execute after try/catch completion
                setMediaProgress(false); // hide progress bar after upload completes or fails
            }
        }
    };

    const editLectureHandler = async () => { // define async function editLectureHandler to update lecture information
        await editLecture({ // call mutation function to send updated data
            lectureTitle, // send lectureTitle from state
            videoInfo: uploadVideoInfo, // send video metadata
            isPreviewFree: isFree, // send free status
            courseId, // send associated courseId
            lectureId, // send current lectureId
        });
    };

    const removeLectureHandler = async () => { // define async function removeLectureHandler to delete a lecture
        await removeLecture(lectureId); // call mutation function with lectureId to remove lecture
    };

    useEffect(() => { // run side effect when lecture edit mutation status changes
        if (isSuccess) { // check if edit was successful
            toast.success(data.message); // show success message from API
        }
        if (error) { // check if edit resulted in error
            toast.error(error.data.message); // show error message from API
        }
    }, [isSuccess, error]); // trigger effect when success or error status changes

    useEffect(() => { // run side effect when lecture removal mutation status changes
        if (removeSuccess) { // check if lecture removal was successful
            toast.success(removeData.message); // show success message from API
        }
    }, [removeSuccess]); // trigger effect only when removeSuccess changes

    return (
        <Card>
            <CardHeader className="flex justify-between">
                <div>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>Make changes and click save when done.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button disabled={removeLoading} variant="destructive" onClick={removeLectureHandler}> 
                        {/* trigger lecture deletion and show loader if in progress */}
                        {removeLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                Please wait
                            </>
                        ) : (
                            "Remove Lecture"
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input 
                        value={lectureTitle} // bind input value to lectureTitle state
                        onChange={(e) => setLectureTitle(e.target.value)} // update state when input changes
                        type="text" 
                        placeholder="Ex. Introduction to Javascript" 
                    />
                </div>
                <div className="my-5">
                    <Label>Video <span className="text-red-500">*</span></Label>
                    <Input 
                        type="file" 
                        accept="video/*" 
                        onChange={fileChangeHandler} // call handler to upload video when file selected
                        className="w-fit" 
                    />
                </div>
                <div className="flex items-center space-x-2 my-5">
                    <Switch 
                        checked={isFree} // bind switch checked state to isFree
                        onCheckedChange={setIsFree} // toggle isFree state when switched
                        id="airplane-mode" 
                    />
                    <Label htmlFor="airplane-mode">Is this video FREE</Label>
                </div>
                {mediaProgress && ( // conditionally render progress bar when upload is active
                    <div className="my-4">
                        <Progress value={uploadProgress} /> 
                        <p>{uploadProgress}% uploaded</p> 
                    </div>
                )}
                <div className="mt-4">
                    <Button 
                        disabled={isLoading} // disable button while update request is processing
                        onClick={editLectureHandler} // trigger lecture edit on click
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                Please wait
                            </>
                        ) : (
                            "Update Lecture"
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default LectureTab; // export LectureTab component for use in other modules