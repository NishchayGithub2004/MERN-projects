import { XIcon } from "lucide-react"; // import XIcon to render a close button icon using lucide-react icon library
import { useChatStore } from "../store/useChatStore"; // import chat store to access selected user state and update it
import { useEffect } from "react"; // import useEffect to handle lifecycle side effects inside the component
import { useAuthStore } from "../store/useAuthStore"; // import auth store to access list of currently online users

function ChatHeader() { // define a functional component to render the active chat header with user info and controls
    const { selectedUser, setSelectedUser } = useChatStore(); // read selected chat user and setter to clear selection
    
    const { onlineUsers } = useAuthStore(); // read online users list from auth store to determine presence status
    
    const isOnline = onlineUsers.includes(selectedUser._id); // determine whether the selected user is currently online

    useEffect(() => { // register and clean up a global keyboard listener for escape key handling
        const handleEscKey = (event) => { // define a keyboard event handler to listen for escape key presses
            if (event.key === "Escape") setSelectedUser(null); // clear selected user when escape key is pressed
        };

        window.addEventListener("keydown", handleEscKey); // attach keydown event listener to the window

        return () => window.removeEventListener("keydown", handleEscKey); // remove event listener on component unmount
    }, [setSelectedUser]); // re-register effect only if setSelectedUser reference changes

    return (
        <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1">
            <div className="flex items-center space-x-3">
                <div className={`avatar ${isOnline ? "online" : "offline"}`}> {/* apply online or offline avatar status dynamically */}
                    <div className="w-12 rounded-full">
                        <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} /> {/* render user profile picture with fallback avatar */}
                    </div>
                </div>

                <div>
                    <h3 className="text-slate-200 font-medium">{selectedUser.fullName}</h3> {/* display selected user's full name */}
                    <p className="text-slate-400 text-sm">{isOnline ? "Online" : "Offline"}</p> {/* show real-time online or offline status */}
                </div>
            </div>

            <button onClick={() => setSelectedUser(null)}> {/* clear selected user when close button is clicked */}
                <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
            </button>
        </div>
    );
}

export default ChatHeader;