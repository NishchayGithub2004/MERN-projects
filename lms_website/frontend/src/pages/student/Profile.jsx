import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // import avatar related components from shadCN UI library
import { Button } from "@/components/ui/button"; // import 'Button' component from shadCN UI library
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // import dialog related components from shadCN UI library
import { Input } from "@/components/ui/input"; // import 'Input' component from shadCN UI library
import { Label } from "@/components/ui/label"; // import 'Label' component from shadCN UI library
import { Loader2 } from "lucide-react"; // import 'Loader2' icon from lucide-react library
import React, { useEffect, useState } from "react"; // import 'useEffect' hook to run side effects and 'useState' hook to manage states
import Course from "./Course"; // import 'Course' component
import { useLoadUserQuery, useUpdateUserMutation } from "@/features/api/authApi"; // import 'useLodUserQuery' and 'useUpdateUserMutation' hook
import { toast } from "sonner"; // import 'toast' for notifications

const Profile = () => { // create a functional component named 'Profile' that doesn't take any props
    const [name, setName] = useState(""); // using 'useState' hook, create a variable named 'name' with empty string as initial value and function 'setName' to change it's value
    const [profilePhoto, setProfilePhoto] = useState(""); // using 'useState' hook, create a variable named 'profilePhoto' with empty string as initial value and function 'setProfilePhoto' to change it's value

    const { data, isLoading, refetch } = useLoadUserQuery(); // extract these things from 'useLoaderUserQuery' hook

    const [ updateUser, { data: updateUserData, isLoading: updateUserIsLoading, isError, error, isSuccess } ] = useUpdateUserMutation(); // import these things from 'useUpdateUserMutation' hook but import 'updateUserData' as 'data' and 'updateUserIsLoading' as 'isLoading'

    const onChangeHandler = (e) => { // handle file input changes
        const file = e.target.files?.[0]; // get first selected file
        if (file) setProfilePhoto(file); // update profilePhoto state
    };

    const updateUserHandler = async () => { // handle profile update submission
        const formData = new FormData(); // create FormData object for file upload
        formData.append("name", name); // append name field
        formData.append("profilePhoto", profilePhoto); // append profile photo file
        await updateUser(formData); // call updateUser mutation with FormData
    };

    useEffect(() => { // use 'useEffect' hook to run side-effect
        refetch(); // call 'refetch' function
    }, []); // leave dependency array empty so that this side-effect runs only once when component is mounted

    useEffect(() => { // use 'useEffect' hook to run side-effect
        if (isSuccess) { // if value of 'isSuccess'is true
            refetch(); // call 'refetch' function
            toast.success(data.message || "Profile updated."); // show toast message with value of 'message' property of 'data' object, or 'Profile updated.' if even that isn't available
        }
        
        if (isError) { // if value of 'isError' is true ie some error occured
            toast.error(error.message || "Failed to update profile"); // show toast message with value of 'message' property of 'error' object, or 'Failed to update profile' if even that isn't available
        }
    }, [error, updateUserData, isSuccess, isError]); // write these in dependency array if value of at least one of these things change

    if (isLoading) return <h1>Profile Loading...</h1>; // show this heading if value of 'isLoading' is true

    return (
        <div className="max-w-4xl mx-auto px-4 my-10">
            <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
                <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
                        <AvatarImage
                            src={user?.photoUrl || "https://github.com/shadcn.png"}
                            alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <div className="mb-2">
                        <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                            Name:
                            <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                                {user.name}
                            </span>
                        </h1>
                    </div>
                    <div className="mb-2">
                        <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                            Email:
                            <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                                {user.email}
                            </span>
                        </h1>
                    </div>
                    <div className="mb-2">
                        <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                            Role:
                            <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                                {user.role.toUpperCase()}
                            </span>
                        </h1>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" className="mt-2">
                                Edit Profile
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>Name</Label>
                                    <Input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)} // when value of this input field changes, call 'setName' function to change value of 'name' to new input value
                                        placeholder="Name"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>Profile Photo</Label>
                                    <Input
                                        onChange={onChangeHandler} // when value of this input field changes, call 'onChangeHandler' function
                                        type="file"
                                        accept="image/*"
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    disabled={updateUserIsLoading} // disable this button if value of 'updateUserIsLoading' is true
                                    onClick={updateUserHandler} // when this button is clicked, call 'updateUserHandler' function
                                >
                                    {updateUserIsLoading ? ( // if value of 'updateUserIsLoading' is true, then render loader icon with message 'Please wait', else render paragraph 'Save Changes'
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div>
                <h1 className="font-medium text-lg">Courses you're enrolled in</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
                    {user.enrolledCourses.length === 0 ? ( // if user is not enrolled in any courses, render this paragraph
                        <h1>You haven't enrolled yet</h1>
                    ) : (
                        user.enrolledCourses.map((course) => ( // otherwise, iterate over courses user is enrolled in and render them
                            <Course course={course} key={course._id} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
