import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react"; // import icons for file, upload, and remove actions from lucide-react library
import { Input } from "../ui/input"; // import Input component from local UI directory for file input element
import { Label } from "../ui/label"; // import Label component from local UI directory for input labeling
import { useEffect, useRef } from "react"; // import useEffect hook for side effects and useRef hook for referencing DOM elements
import { Button } from "../ui/button"; // import Button component from local UI directory
import axios from "axios"; // import axios library for making HTTP requests
import { Skeleton } from "../ui/skeleton"; // import Skeleton component for loading state placeholder

function ProductImageUpload({ // define ProductImageUpload component and destructure its props for image handling logic
    imageFile, // holds the current selected image file
    setImageFile, // function to update imageFile state
    imageLoadingState, // indicates whether image upload is in progress
    uploadedImageUrl, // holds the uploaded image URL after successful upload
    setUploadedImageUrl, // function to update uploadedImageUrl state
    setImageLoadingState, // function to update imageLoadingState
    isEditMode, // boolean to disable upload when editing an existing item
    isCustomStyling = false, // optional boolean prop to control custom layout styling
}) {
    const inputRef = useRef(null); // create a reference to the hidden file input element for manual control (resetting its value later)

    console.log(isEditMode, "isEditMode"); // log edit mode state to console for debugging

    function handleImageFileChange(event) { // define handler for when a file is selected using file input
        console.log(event.target.files, "event.target.files"); // log file list for debugging
        
        const selectedFile = event.target.files?.[0]; // get the first selected file using optional chaining to avoid undefined errors
        
        console.log(selectedFile); // log selected file for debugging

        if (selectedFile) setImageFile(selectedFile); // if file exists, update imageFile state with selected file
    }

    function handleDragOver(event) { // define handler for drag-over event on drop zone
        event.preventDefault(); // prevent default browser behavior to allow dropping files
    }

    function handleDrop(event) { // define handler for file drop event
        event.preventDefault(); // prevent default browser behavior of opening dropped file
        
        const droppedFile = event.dataTransfer.files?.[0]; // extract the first dropped file safely using optional chaining
        
        if (droppedFile) setImageFile(droppedFile); // if a file is dropped, update imageFile state with dropped file
    }

    function handleRemoveImage() { // define handler to remove the currently selected image
        setImageFile(null); // reset imageFile state to null
        
        if (inputRef.current) { // check if inputRef is assigned to the file input element
            inputRef.current.value = ""; // clear input element value to allow re-uploading the same file later
        }
    }

    async function uploadImageToCloudinary() { // define async function to upload image to Cloudinary via backend API
        setImageLoadingState(true); // set loading state to true before upload begins
        
        const data = new FormData(); // create a new FormData object to send file data in multipart/form format
        
        data.append("my_file", imageFile); // append imageFile under key 'my_file' for server-side access
        
        const response = await axios.post( // send POST request using axios to backend endpoint handling image uploads
            "http://localhost:5000/api/admin/products/upload-image", // local backend endpoint for image upload
            data // send the FormData object as the request body
        );
        
        console.log(response, "response"); // log the response for debugging

        if (response?.data?.success) { // check if upload succeeded based on response structure
            setUploadedImageUrl(response.data.result.url); // update uploadedImageUrl state with Cloudinary URL
            setImageLoadingState(false); // set loading state to false after upload completes
        }
    }

    useEffect(() => { // use useEffect to trigger side effects when dependencies change
        if (imageFile !== null) uploadImageToCloudinary(); // if a new file is selected, call uploadImageToCloudinary to start upload
    }, [imageFile]); // dependency array ensures effect runs whenever imageFile changes

    return (
        <div className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
            <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`${isEditMode ? "opacity-60" : ""} border-2 border-dashed rounded-lg p-4`}
            >
                <Input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    ref={inputRef}
                    onChange={handleImageFileChange}
                    disabled={isEditMode}
                />
                {!imageFile ? (
                    <Label
                        htmlFor="image-upload"
                        className={`${isEditMode ? "cursor-not-allowed" : ""} flex flex-col items-center justify-center h-32 cursor-pointer`}
                    >
                        <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                        <span>Drag & drop or click to upload image</span>
                    </Label>
                ) : imageLoadingState ? (
                    <Skeleton className="h-10 bg-gray-100" />
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FileIcon className="w-8 text-primary mr-2 h-8" />
                        </div>
                        <p className="text-sm font-medium">{imageFile.name}</p>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={handleRemoveImage}
                        >
                            <XIcon className="w-4 h-4" />
                            <span className="sr-only">Remove File</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductImageUpload;
