import { Loader2, LocateIcon, Mail, MapPin, MapPinnedIcon, Plus } from "lucide-react"; // import multiple icon components used for UI representation of profile fields
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"; // import avatar components to display and manage user profile image
import { type FormEvent, useRef, useState } from "react"; // import form event type, reference hook, and state hook from react for managing state and DOM references
import { Input } from "./ui/input"; // import input component used for user input fields
import { Label } from "./ui/label"; // import label component for field labels
import { Button } from "./ui/button"; // import button component for form submission
import { useUserStore } from "@/store/useUserStore"; // import user store hook to access and update user-related global state

const Profile = () => { // define a functional component named 'Profile' to manage user profile editing form
    const { user, updateProfile } = useUserStore(); // destructure 'user' and 'updateProfile' function from global user store for accessing and updating user data
    
    const [isLoading, setIsLoading] = useState<boolean>(false); // create state variable 'isLoading' with initial value false to indicate loading state during form submission
    
    const [profileData, setProfileData] = useState({ // create state variable 'profileData' to store editable user details
        fullname: user?.fullname || "", // set initial value to user's fullname or empty string if not available
        email: user?.email || "", // set initial value to user's email or empty string
        address: user?.address || "", // set initial value to user's address or empty string
        city: user?.city || "", // set initial value to user's city or empty string
        country: user?.country || "", // set initial value to user's country or empty string
        profilePicture: user?.profilePicture || "", // set initial value to user's profile picture or empty string
    });
    
    const imageRef = useRef<HTMLInputElement | null>(null); // create a reference to input element for programmatic click on hidden file input
    
    const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>(profileData.profilePicture || ""); // create state variable 'selectedProfilePicture' to store currently selected or uploaded profile image

    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => { // define a function to handle file input changes for profile image upload
        const file = e.target.files?.[0]; // extract the first selected file from input event
        
        if (file) { // if a file is selected
            const reader = new FileReader(); // create new file reader to convert file into base64 string
            
            reader.onloadend = () => { // define callback executed after file reading completes
                const result = reader.result as string; // store the read content of file as string
                setSelectedProfilePicture(result); // update selectedProfilePicture state with new image data
                setProfileData((prevData) => ({ ...prevData, profilePicture: result })); // update profileData object to include new profile picture
            };
            
            reader.readAsDataURL(file); // initiate reading file as base64 string for image display
        }
    };

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => { // define a function to handle changes in text input fields
        const { name, value } = e.target; // extract name and value properties from input event
        setProfileData({ ...profileData, [name]: value }); // update profileData object dynamically based on changed input field
    };

    const updateProfileHandler = async (e: FormEvent<HTMLFormElement>) => { // define async function to handle form submission for updating user profile
        e.preventDefault(); // prevent default browser form submission to handle manually
        try {
            setIsLoading(true); // enable loading state to indicate submission in progress
            await updateProfile(profileData); // call updateProfile function from store to update user data with current profileData
            setIsLoading(false); // disable loading state when profile update is complete
        } catch (error) { 
            setIsLoading(false); // disable loading state if an error occurs during update
        }
    };

    return (
        <form onSubmit={updateProfileHandler} className="max-w-7xl mx-auto my-5"> 
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar className="relative md:w-28 md:h-28 w-20 h-20">
                        <AvatarImage src={selectedProfilePicture} /> 
                        <AvatarFallback>CN</AvatarFallback>
                        <Input
                            ref={imageRef}
                            className="hidden"
                            type="file"
                            accept="image/*"
                            onChange={fileChangeHandler} // handle file input changes with fileChangeHandler to update selected image
                        />
                        <div
                            onClick={() => imageRef.current?.click()} // trigger hidden input click event when avatar overlay is clicked to open file chooser
                            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full cursor-pointer"
                        >
                            <Plus className="text-white w-8 h-8" />
                        </div>
                    </Avatar>
                    <Input
                        type="text"
                        name="fullname"
                        value={profileData.fullname}
                        onChange={changeHandler} // handle fullname input changes to update profileData
                        className="font-bold text-2xl outline-none border-none focus-visible:ring-transparent"
                    />
                </div>
            </div>
            <div className="grid md:grid-cols-4 md:gap-2 gap-3 my-10">
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                    <Mail className="text-gray-500" />
                    <div className="w-full">
                        <Label>Email</Label>
                        <Input
                            disabled
                            name="email"
                            value={profileData.email}
                            onChange={changeHandler} // handle email change, though field is disabled for editing
                            className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                    <LocateIcon className="text-gray-500" />
                    <div className="w-full">
                        <Label>Address</Label>
                        <Input
                            name="address"
                            value={profileData.address}
                            onChange={changeHandler} // handle address input changes to update profileData
                            className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                    <MapPin className="text-gray-500" />
                    <div className="w-full">
                        <Label>City</Label>
                        <Input
                            name="city"
                            value={profileData.city}
                            onChange={changeHandler} // handle city input changes to update profileData
                            className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                    <MapPinnedIcon className="text-gray-500" />
                    <div className="w-full">
                        <Label>Country</Label>
                        <Input
                            name="country"
                            value={profileData.country}
                            onChange={changeHandler} // handle country input changes to update profileData
                            className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                        />
                    </div>
                </div>
            </div>
            <div className="text-center">
                {isLoading ? ( 
                    <Button disabled className="bg-orange hover:bg-hoverOrange">
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Please wait
                    </Button>
                ) : (
                    <Button type="submit" className="bg-orange hover:bg-hoverOrange">Update</Button> // trigger updateProfileHandler on click to submit profile updates
                )}
            </div>
        </form>
    );
};

export default Profile; // export the Profile component for use in other modules