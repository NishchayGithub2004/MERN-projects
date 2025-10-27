import { Loader2, LocateIcon, Mail, MapPin, MapPinnedIcon, Plus } from "lucide-react"; // import these icons from lucide-react library
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"; // import these Avatar components from shadCN UI library
import { type FormEvent, useRef, useState } from "react"; // import 'FormEvent' type to handle form events, 'useRef' hook to create a reference to the input element, and 'useState' hook to manage states
import { Input } from "./ui/input"; // import Input component from shadCN UI library
import { Label } from "./ui/label"; // import Label component from shadCN UI library
import { Button } from "./ui/button"; // import Button component from shadCN UI library
import { useUserStore } from "@/store/useUserStore"; // import 'useUserStore' hook to access user-related state and actions

const Profile = () => { // create a functional component named 'Profile' that doesn't take any props
    const { user, updateProfile } = useUserStore(); // extract 'user' and 'updateProfile' from 'useUserStore' hook
    
    const [isLoading, setIsLoading] = useState<boolean>(false); // using 'useState' hook, create a boolean state variable 'isLoading' with initial value of false and a function 'setIsLoading' to update the value of variable
    
    const [profileData, setProfileData] = useState({ // using 'useState' hook, create an object state variable 'profileData' and a function 'setProfileData' to update the object properties
    // the initial values of object properties are values present in 'user' object or empty string if they don't have a value in 'user' object
        fullname: user?.fullname || "",
        email: user?.email || "",
        address: user?.address || "",
        city: user?.city || "",
        country: user?.country || "",
        profilePicture: user?.profilePicture || "",
    });
    
    const imageRef = useRef<HTMLInputElement | null>(null); // create an instance of 'useRef' hook to create a reference to form input element
    // it's initial value is null since initially it doesn't refer to any input element
    
    const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>(profileData.profilePicture || "");
    // using 'useState' hook, create a state variable 'selectedProfilePicture' and function 'setSelectedProfilePicture' to update the value of this state variable
    // the initial value of this state variable is the value of 'profilePicture' property of 'profileData' object or an empty string if it doesn't have a value in the object

    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => { // create a function named 'fileChangeHandler' that takes event object that responts to change in value of an input field
        const file = e.target.files?.[0]; // get the first file from the list of files selected by the user (actually even a single file is present in array form, so [0] is necessary to extract even that one single file)
        
        if (file) { // if a file is selected by the user
            const reader = new FileReader(); // create an instance of 'FileReader' object to read the contents of the selected file
            
            reader.onloadend = () => { // this a callback funcction that will be executed when the reading operation is completed
                const result = reader.result as string; // read the contents of the selected file as string, which were read in base64 format
                
                setSelectedProfilePicture(result); // update the value of 'selectedProfilePicture' state variable with the contents of the selected file
                
                setProfileData((prevData) => ({ // take pre-existing data of 'profileData' state variable
                    ...prevData, // copy the pre-existing data using spread operator
                    profilePicture: result, // allot 'result' as the new value of 'profilePicture' property
                }));
            };
            
            reader.readAsDataURL(file); // read the contents of new profile picture in base64 format
        }
    };

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => { // create a function named 'changeHandler' that takes event object that responds to change in value of input field as argument
        const { name, value } = e.target; // extract 'name' and 'value' properties of input field
        setProfileData({ ...profileData, [name]: value }); // using spread operator, copy the pre-existing data of 'profileData' state variable and update the value of property with name same as 'name' variable with new value of 'value' variable
    };

    const updateProfileHandler = async (e: FormEvent<HTMLFormElement>) => { // create a function named 'updateProfileHandler' that takes event object that responds to form submission as argument
        e.preventDefault(); // prevent the default behaviour of form submission which is to submit the form as soon as submit button is clicked, this is done to do some work before form is actually submitted
        
        try {
            setIsLoading(true); // set value of 'isLoading' state variable to true to indicate that the form is in the process of submitting
            await updateProfile(profileData); // call 'updateProfile' function with 'profileData' object as argument to update the user's profile
            setIsLoading(false); // set value of 'isLoading' state variable to false to indicate that the form has been submitted successfully
        } catch (error) { // if any error occurs during form submission
            setIsLoading(false); // set value of 'isLoading' state variable to false to indicate that the form submission has failed
        }
    };

    return (
        <form onSubmit={updateProfileHandler} className="max-w-7xl mx-auto my-5"> {/* when the form is clicked, 'updateProfileHandler' function is executed */}
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
                            onChange={fileChangeHandler} // when the value of this input field is changed, 'fileChangeHandler' function is executed
                        />
                        <div
                            onClick={() => imageRef.current?.click()} // clicking this 'div' element will trigger the click event on the input element with ref 'imageRef'
                            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full cursor-pointer"
                        >
                            <Plus className="text-white w-8 h-8" />
                        </div>
                    </Avatar>
                    <Input
                        type="text"
                        name="fullname"
                        value={profileData.fullname}
                        onChange={changeHandler}
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
                            onChange={changeHandler}
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
                            onChange={changeHandler}
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
                            onChange={changeHandler}
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
                            onChange={changeHandler}
                            className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                        />
                    </div>
                </div>
            </div>
            <div className="text-center">
                {isLoading ? ( // if value of 'isLoading' state variable is true, render first buton, else render second button
                    <Button disabled className="bg-orange hover:bg-hoverOrange">
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Please wait
                    </Button>
                ) : (
                    <Button type="submit" className="bg-orange hover:bg-hoverOrange">Update</Button>
                )}
            </div>
        </form>
    );
};

export default Profile;