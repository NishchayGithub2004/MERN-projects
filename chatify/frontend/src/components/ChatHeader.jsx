import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore"; // import custom hook 'useChatStore' to access chat related states and functions
import { useEffect } from "react"; // import 'useEffect' hook to run side-effects
import { useAuthStore } from "../store/useAuthStore"; // import custom hook 'useAuthStore' to access authentication related states and functions

function ChatHeader() {
    const { selectedUser, setSelectedUser } = useChatStore(); // extract 'selectedUser' state and 'setSelectedUser' function from custom hook 'useChatStore'
    
    const { onlineUsers } = useAuthStore(); // extract 'onlineUsers' state from custom hook 'useAuthStore'
    
    const isOnline = onlineUsers.includes(selectedUser._id); // check if 'onlineUsers' array includes unique ID of 'selectedUser' ie we check if the selected user is online or not

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === "Escape") setSelectedUser(null); // create a function named 'handleEscKey' that sets 'selectedUser' state to 'null' when 'Escape' key is pressed
        };

        window.addEventListener("keydown", handleEscKey); // add event listener to window object to listen for key pressing events and call 'handleEscKey' function when 'Escape' key is pressed

        return () => window.removeEventListener("keydown", handleEscKey); // remove event listener when component unmounts as a cleanup
    }, [setSelectedUser]); // re-run the side-effect when 'setSelectedUser' function changes

    return (
        <div
            className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1"
        >
            <div className="flex items-center space-x-3">
                <div className={`avatar ${isOnline ? "online" : "offline"}`}> {/* implement style based on value of 'isOnline' ie if selected user is online or not */}
                    <div className="w-12 rounded-full">
                        <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} /> {/* render profile pic of selected user (full name if not available) */}
                    </div>
                </div>

                <div>
                    {/* render selected user's full name and online/offline state depending on value of 'isOnline' */}
                    <h3 className="text-slate-200 font-medium">{selectedUser.fullName}</h3>
                    <p className="text-slate-400 text-sm">{isOnline ? "Online" : "Offline"}</p>
                </div>
            </div>

            <button onClick={() => setSelectedUser(null)}> {/* clicking this button sets 'selectedUser' to null ie selected user is unselected */}
                <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
            </button>
        </div>
    );
}

export default ChatHeader;