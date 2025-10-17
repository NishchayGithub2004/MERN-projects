import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // import Avatar components for profile picture
import { Button } from "@/components/ui/button"; // import Button component
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // import Dialog components for editing profile
import { Input } from "@/components/ui/input"; // import Input component for form fields
import { Label } from "@/components/ui/label"; // import Label component for form field labels
import { Loader2 } from "lucide-react"; // import loader icon for loading states
import React, { useEffect, useState } from "react"; // import React, useEffect, and useState hook
import Course from "./Course"; // import Course component
import { useLoadUserQuery, useUpdateUserMutation } from "@/features/api/authApi"; // import RTK query/mutation hooks for user API
import { toast } from "sonner"; // import toast for notifications

const Profile = () => { // define Profile component to display and edit user profile
    const [name, setName] = useState(""); // state to track user name input
    const [profilePhoto, setProfilePhoto] = useState(""); // state to track uploaded profile photo

    const { data, isLoading, refetch } = useLoadUserQuery(); // fetch current user data and track loading

    const [
        updateUser,
        {
            data: updateUserData,
            isLoading: updateUserIsLoading,
            isError,
            error,
            isSuccess,
        },
    ] = useUpdateUserMutation(); // setup mutation for updating user profile

    console.log(data); // debug: log fetched user data

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

    useEffect(() => { // refetch user data on component mount
        refetch(); 
    }, []);

    useEffect(() => { // handle success or error notifications after update
        if (isSuccess) {
            refetch(); // refresh user data after successful update
            toast.success(data.message || "Profile updated."); // show success toast
        }
        
        if (isError) {
            toast.error(error.message || "Failed to update profile"); // show error toast
        }
    }, [error, updateUserData, isSuccess, isError]);

    if (isLoading) return <h1>Profile Loading...</h1>; // show loading message while fetching data

    const user = data && data.user; // extract user object from API response

    console.log(user); // debug: log user object

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
                                    Make changes to your profile here. Click save when you're
                                    done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>Name</Label>
                                    <Input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Name"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>Profile Photo</Label>
                                    <Input
                                        onChange={onChangeHandler}
                                        type="file"
                                        accept="image/*"
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    disabled={updateUserIsLoading}
                                    onClick={updateUserHandler}
                                >
                                    {updateUserIsLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                                            wait
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
                    {user.enrolledCourses.length === 0 ? (
                        <h1>You haven't enrolled yet</h1>
                    ) : (
                        user.enrolledCourses.map((course) => (
                            <Course course={course} key={course._id} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;