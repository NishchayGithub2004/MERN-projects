import { Button } from "@/components/ui/button"; // import Button component for actions
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // import Card components for structured layout
import { Input } from "@/components/ui/input"; // import Input component for text and file inputs
import { Label } from "@/components/ui/label"; // import Label component for input labeling
import { Progress } from "@/components/ui/progress"; // import Progress component for showing upload progress
import { Switch } from "@/components/ui/switch"; // import Switch component for toggling isFree state
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from "@/features/api/courseApi"; // import hooks for lecture API operations
import axios from "axios"; // import axios for HTTP requests
import { Loader2 } from "lucide-react"; // import Loader2 icon for loading indication
import React, { useEffect, useState } from "react"; // import React and hooks for state and side effects
import { useParams } from "react-router-dom"; // import useParams to get dynamic route parameters
import { toast } from "sonner"; // import toast for showing success/error notifications

const MEDIA_API = "http://localhost:3000/api/v1/media"; // define API endpoint for media uploads

const LectureTab = () => { // define a function component LectureTab
    const [lectureTitle, setLectureTitle] = useState(""); // state to store lecture title
    const [uploadVideInfo, setUploadVideoInfo] = useState(null); // state to store uploaded video info
    const [isFree, setIsFree] = useState(false); // state to store if lecture is free preview
    const [mediaProgress, setMediaProgress] = useState(false); // state to track media uploading progress
    const [uploadProgress, setUploadProgress] = useState(0); // state to track percentage of upload progress
    const [btnDisable, setBtnDisable] = useState(true); // state to control upload button disable status

    const params = useParams(); // get route params
    const { courseId, lectureId } = params; // destructure courseId and lectureId from route params

    const { data: lectureData } = useGetLectureByIdQuery(lectureId); // fetch lecture data by lectureId
    const lecture = lectureData?.lecture; // extract lecture object from fetched data

    useEffect(() => { // populate form fields when lecture data is available
        if (lecture) {
            setLectureTitle(lecture.lectureTitle); // set lecture title
            setIsFree(lecture.isPreviewFree); // set free preview toggle
            setUploadVideoInfo(lecture.videoInfo); // set video info
        }
    }, [lecture]); // run effect whenever lecture data changes

    const [edtiLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation(); 
    // destructure mutation function and its state from useEditLectureMutation hook

    const [removeLecture, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess }] = useRemoveLectureMutation(); 
    // destructure mutation function and its state from useRemoveLectureMutation hook

    const fileChangeHandler = async (e) => { // handle file input change and upload video
        const file = e.target.files[0]; // get first selected file
        
        if (file) {
            const formData = new FormData(); // create FormData to send file
            formData.append("file", file); // append file to FormData
            
            setMediaProgress(true); // show progress bar
            
            try {
                const res = await axios.post(
                    `${MEDIA_API}/upload-video`, // API endpoint for uploading video
                    formData, // FormData containing file
                    {
                        onUploadProgress: ({ loaded, total }) => { // track upload progress
                            setUploadProgress(Math.round((loaded * 100) / total)); // calculate percentage
                        },
                    }
                );

                if (res.data.success) { // check if upload was successful
                    console.log(res); // log response for debugging
                    
                    setUploadVideoInfo({ // store uploaded video information
                        videoUrl: res.data.data.url,
                        publicId: res.data.data.public_id,
                    });
                    
                    setBtnDisable(false); // enable buttons after successful upload
                    
                    toast.success(res.data.message); // show success toast
                }
            } catch (error) { // handle upload error
                console.log(error); // log error
                toast.error("video upload failed"); // show error toast
            } finally {
                setMediaProgress(false); // hide progress bar after upload completes
            }
        }
    };

    const editLectureHandler = async () => { // handle editing lecture
        console.log({ lectureTitle, uploadVideInfo, isFree, courseId, lectureId }); // log data to be sent
        
        await edtiLecture({ // call mutation to edit lecture
            lectureTitle,
            videoInfo: uploadVideInfo,
            isPreviewFree: isFree,
            courseId,
            lectureId,
        });
    };

    const removeLectureHandler = async () => { // handle removing lecture
        await removeLecture(lectureId); // call mutation to remove lecture by lectureId
    };

    useEffect(() => { // handle edit lecture response
        if (isSuccess) { // check if edit was successful
            toast.success(data.message); // show success toast
        }
        
        if (error) { // check if error occurred
            toast.error(error.data.message); // show error toast
        }
    }, [isSuccess, error]); // run effect when isSuccess or error changes

    useEffect(() => { // handle remove lecture response
        if (removeSuccess) { // check if removal was successful
            toast.success(removeData.message); // show success toast
        }
    }, [removeSuccess]); // run effect when removeSuccess changes

    return (
        <Card>
            <CardHeader className="flex justify-between">
                <div>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>
                        Make changes and click save when done.
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button disbaled={removeLoading} variant="destructive" onClick={removeLectureHandler}>
                        {
                            removeLoading ? <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </> : "Remove Lecture"
                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        type="text"
                        placeholder="Ex. Introduction to Javascript"
                    />
                </div>
                <div className="my-5">
                    <Label>
                        Video <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="file"
                        accept="video/*"
                        onChange={fileChangeHandler}
                        placeholder="Ex. Introduction to Javascript"
                        className="w-fit"
                    />
                </div>
                <div className="flex items-center space-x-2 my-5">
                    <Switch checked={isFree} onCheckedChange={setIsFree} id="airplane-mode" />
                    <Label htmlFor="airplane-mode">Is this video FREE</Label>
                </div>

                {mediaProgress && (
                    <div className="my-4">
                        <Progress value={uploadProgress} />
                        <p>{uploadProgress}% uploaded</p>
                    </div>
                )}

                <div className="mt-4">
                    <Button disabled={isLoading} onClick={editLectureHandler}>
                        {
                            isLoading ? <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </> : "Update Lecture"
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default LectureTab;
