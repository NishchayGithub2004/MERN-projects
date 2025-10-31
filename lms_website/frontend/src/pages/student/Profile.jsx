import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // import avatar components for displaying user profile image
import { Button } from "@/components/ui/button"; // import Button component for clickable actions
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // import dialog components for modal UI
import { Input } from "@/components/ui/input"; // import Input component for text or file inputs
import { Label } from "@/components/ui/label"; // import Label component to describe form fields
import { Loader2 } from "lucide-react"; // import Loader2 icon for loading indicator
import React, { useEffect, useState } from "react"; // import React hooks for state and lifecycle management
import Course from "./Course"; // import Course component for displaying individual courses
import { useLoadUserQuery, useUpdateUserMutation } from "@/features/api/authApi"; // import hooks to load user data and update user profile
import { toast } from "sonner"; // import toast for displaying notifications

const Profile = () => { // define functional component Profile to display and edit user profile
    const [name, setName] = useState(""); // create state variable name with empty string as initial value
    const [profilePhoto, setProfilePhoto] = useState(""); // create state variable profilePhoto with empty string as initial value
    const { data, isLoading, refetch } = useLoadUserQuery(); // call useLoadUserQuery to fetch user data and provide refetch function

    const [
        updateUser, // function to trigger user update mutation
        { data: updateUserData, isLoading: updateUserIsLoading, isError, error, isSuccess } // destructure mutation result and status properties
    ] = useUpdateUserMutation(); // call useUpdateUserMutation to handle profile update API

    const onChangeHandler = (e) => { // handle change in profile photo input
        const file = e.target.files?.[0]; // get first selected file from input
        if (file) setProfilePhoto(file); // update profilePhoto state if file exists
    };

    const updateUserHandler = async () => { // handle click on Save Changes button
        const formData = new FormData(); // create FormData object to send file and text data
        formData.append("name", name); // append name to formData
        formData.append("profilePhoto", profilePhoto); // append selected profile photo to formData
        await updateUser(formData); // call mutation function to send update request
    };

    useEffect(() => { // run on component mount
        refetch(); // refetch user data once when component mounts
    }, []); // empty dependency array ensures it runs only once

    useEffect(() => { // handle mutation result changes
        if (isSuccess) { // when profile update is successful
            refetch(); // refetch user data to refresh displayed profile
            toast.success(updateUserData?.message || "Profile updated."); // show success message in toast
        }
        if (isError) { // when profile update fails
            toast.error(error?.message || "Failed to update profile"); // show error message in toast
        }
    }, [error, updateUserData, isSuccess, isError]); // re-run effect when any dependency changes

    if (isLoading) return <h1>Profile Loading...</h1>; // show loading message while fetching profile data

    const user = data?.user; // extract user object from data for easier access

    return (
        <div className="max-w-4xl mx-auto px-4 my-10"> {/* main container for profile section */}
            <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1> {/* profile section heading */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5"> {/* layout for avatar and profile details */}
                <div className="flex flex-col items-center"> {/* avatar container */}
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4"> {/* user avatar display */}
                        <AvatarImage
                            src={user?.photoUrl || "https://github.com/shadcn.png"} // display user photo or fallback image
                            alt="@shadcn" // alt text for accessibility
                        />
                        <AvatarFallback>CN</AvatarFallback> {/* fallback initials if image unavailable */}
                    </Avatar>
                </div>
                <div> {/* user information section */}
                    <div className="mb-2">
                        <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                            Name:
                            <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                                {user?.name} {/* display user name */}
                            </span>
                        </h1>
                    </div>
                    <div className="mb-2">
                        <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                            Email:
                            <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                                {user?.email} {/* display user email */}
                            </span>
                        </h1>
                    </div>
                    <div className="mb-2">
                        <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                            Role:
                            <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                                {user?.role.toUpperCase()} {/* display user role in uppercase */}
                            </span>
                        </h1>
                    </div>
                    <Dialog> {/* dialog for editing profile */}
                        <DialogTrigger asChild> {/* define button as dialog trigger */}
                            <Button size="sm" className="mt-2">Edit Profile</Button> {/* button to open edit dialog */}
                        </DialogTrigger>
                        <DialogContent> {/* main dialog content */}
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle> {/* dialog title */}
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you're done. {/* dialog instructions */}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4"> {/* form grid layout */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>Name</Label> {/* label for name input */}
                                    <Input
                                        type="text" // text input type
                                        value={name} // bind input value to name state
                                        onChange={(e) => setName(e.target.value)} // update name on change
                                        placeholder="Name" // placeholder text
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>Profile Photo</Label> {/* label for profile photo input */}
                                    <Input
                                        onChange={onChangeHandler} // handle file selection
                                        type="file" // file input type
                                        accept="image/*" // accept only image files
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    disabled={updateUserIsLoading} // disable button while update is in progress
                                    onClick={updateUserHandler} // handle save button click
                                >
                                    {updateUserIsLoading ? ( // show loading indicator if updating
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait {/* loader with text */}
                                        </>
                                    ) : (
                                        "Save Changes" // show normal button text otherwise
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div> {/* user courses section */}
                <h1 className="font-medium text-lg">Courses you're enrolled in</h1> {/* section heading */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5"> {/* responsive grid for courses */}
                    {user?.enrolledCourses.length === 0 ? ( // check if user is not enrolled in any course
                        <h1>You haven't enrolled yet</h1> // display message when no courses found
                    ) : (
                        user?.enrolledCourses.map((course) => ( // iterate through enrolled courses
                            <Course course={course} key={course._id} /> // render Course component for each course
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile; // export Profile component for use in other parts of app