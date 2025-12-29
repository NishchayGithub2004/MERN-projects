import { useState, useRef } from "react"; // import react hooks to manage local component state and DOM references
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react"; // import icons to represent logout and sound toggle states
import { useAuthStore } from "../store/useAuthStore"; // import auth store to access user data and profile-related actions
import { useChatStore } from "../store/useChatStore"; // import chat store to read and toggle sound preference

const mouseClickSound = new Audio("/sounds/mouse-click.mp3"); // preload mouse click sound to provide instant audio feedback on interactions

function ProfileHeader() { // define a functional component to render user profile header and controls
    const { logout, authUser, updateProfile } = useAuthStore(); // extract logout action, authenticated user data, and profile update function
    
    const { isSoundEnabled, toggleSound } = useChatStore(); // extract sound preference state and toggle function
    
    const [selectedImg, setSelectedImg] = useState(null); // manage locally selected profile image preview state

    const fileInputRef = useRef(null); // create a ref to programmatically control the hidden file input

    const handleImageUpload = (e) => { // define handler to process profile image selection
        const file = e.target.files[0]; // read the first selected file from file input
        
        if (!file) return; // exit early if no file is selected

        const reader = new FileReader(); // create a FileReader to convert image into base64 format
        
        reader.readAsDataURL(file); // start reading image file as a data URL

        reader.onloadend = async () => { // handle logic after file reading completes
            const base64Image = reader.result; // extract base64-encoded image string from FileReader
            setSelectedImg(base64Image); // update local state to reflect newly selected image
            await updateProfile({ profilePic: base64Image }); // update user profile picture on backend using base64 image
        };
    };

    return (
        <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="avatar online">
                        <button
                            className="size-14 rounded-full overflow-hidden relative group"
                            onClick={() => fileInputRef.current.click()} // programmatically trigger hidden file input when avatar button is clicked
                        >
                            <img
                                src={selectedImg || authUser.profilePic || "/avatar.png"} // resolve profile image source by prioritizing newly selected image, then saved profile image, then fallback avatar
                                alt="User image"
                                className="size-full object-cover"
                            />
                            
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-xs">Change</span>
                            </div>
                        </button>

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef} // attach ref to allow avatar button to trigger file picker
                            onChange={handleImageUpload} // handle image selection and upload when a new file is chosen
                            className="hidden"
                        />
                    </div>

                    <div>
                        <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">{authUser.fullName}</h3> {/* display authenticated user's full name from auth store */}
                        <p className="text-slate-400 text-xs">Online</p>
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <button
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                        onClick={logout} // invoke logout action to terminate user session
                    >
                        <LogOutIcon className="size-5" />
                    </button>

                    <button
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                        onClick={() => { // handle sound toggle with immediate click feedback
                            mouseClickSound.currentTime = 0; // reset audio playback position to allow rapid repeated clicks
                            mouseClickSound.play().catch((error) => console.log("Audio play failed:", error)); // play click sound and safely handle autoplay failures
                            toggleSound(); // toggle global sound-enabled preference in chat store
                        }}
                    >
                        {isSoundEnabled ? ( // conditionally render icon based on current sound-enabled state
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