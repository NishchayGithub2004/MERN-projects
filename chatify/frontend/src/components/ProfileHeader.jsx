import { useState, useRef } from "react"; // import 'useState' hook to create state variables and functions to change their values, and 'useRef' hook to make a direct reference to a DOM element
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore"; // import custom hook 'useAuthStore' to access authentication related states and functions
import { useChatStore } from "../store/useChatStore"; // import custom hook 'useChatStore' to access chat related states and functions

const mouseClickSound = new Audio("/sounds/mouse-click.mp3"); // create an audio object to play sound when user clicks on a button

function ProfileHeader() { // create a functional component named 'ProfileHeader' to render the profile header section
    const { logout, authUser, updateProfile } = useAuthStore(); // from custom hook 'useAuthStore', extract 'logout' and 'authUser' states and 'updateProfile' function
    
    const { isSoundEnabled, toggleSound } = useChatStore(); // from custom hook 'useChatStore', extract 'isSoundEnabled' states and 'toggleSound' functions
    
    const [selectedImg, setSelectedImg] = useState(null); // create a state variable 'selectedImg' to store the selected image file and a function 'setSelectedImg' to update its value

    const fileInputRef = useRef(null); // create a direct reference to the file input element using 'useRef' hook with initial value of null since initially no reference to any file input is made

    const handleImageUpload = (e) => { // create a function named 'handleImageUpload' to handle image upload process, it takes event object as argument
        const file = e.target.files[0]; // select the file from file input
        
        if (!file) return; // if no file is selected, stop further execution of the function

        const reader = new FileReader(); // create an instance of 'FileReader' class to read the file's contents
        
        reader.readAsDataURL(file); // read the file's contents as a data URL

        reader.onloadend = async () => { // when the reading process is completed
            const base64Image = reader.result; // store the data URL of the image
            
            setSelectedImg(base64Image); // set value of 'selectedImg' state variable to the data URL of the image
            
            await updateProfile({ profilePic: base64Image }); // call 'updateProfile' function with value of 'profilePic' field as the data URL of the image to update the user's profile picture
        };
    };

    return (
        <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="avatar online">
                        <button
                            className="size-14 rounded-full overflow-hidden relative group"
                            onClick={() => fileInputRef.current.click()} // clicking this button makes the file input element visible for user to select an image file
                        >
                            <img
                                src={selectedImg || authUser.profilePic || "/avatar.png"} // render selected image or authenticated user's profile picture or a default image if no image is selected or authenticated user's profile picture is not available
                                alt="User image"
                                className="size-full object-cover"
                            />
                            
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-xs">Change</span>
                            </div>
                        </button>

                        <input
                            type="file"
                            accept="image/*" // accept only images for this input field
                            ref={fileInputRef} // make a direct reference to this input field using 'useRef' hook
                            onChange={handleImageUpload} // when user selects an image file, call 'handleImageUpload' function to handle the upload process
                            className="hidden"
                        />
                    </div>

                    <div>
                        <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">{authUser.fullName}</h3> {/* render authenticated user's full name */}
                        <p className="text-slate-400 text-xs">Online</p>
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <button
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                        onClick={logout} // clicking this button calls 'logout' function to log out the user
                    >
                        <LogOutIcon className="size-5" />
                    </button>

                    <button
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                        onClick={() => { // when this button is clicked
                            mouseClickSound.currentTime = 0; // set mouse click sound' current time to 0 to start playing from the beginning
                            
                            mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
                            // play the mouse click sound and handle any errors that may occur by logging it to the console to know what error occured
                            
                            toggleSound(); // call 'toggleSound' function to toggle the sound on/off
                        }}
                    >
                        {/* render volume on or off icon depending on whether the value of 'isSoundAvailable' state is true or false */}
                        {isSoundEnabled ? (
                            <Volume2Icon className="size-5" />
                        ) : (
                            <VolumeOffIcon className="size-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfileHeader;