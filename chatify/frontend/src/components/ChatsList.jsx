import { useEffect } from "react"; // import 'useEffect' hook to run side-effects
import { useChatStore } from "../store/useChatStore"; // import custom hook 'useChatStore' to access chat related states and functions
import UsersLoadingSkeleton from "./UsersLoadingSkeleton"; // import 'UsersLoadingSkeleton' component to display loading skeleton while fetching users
import NoChatsFound from "./NoChatsFound"; // import 'NoChatsFound' component to display message when no chats found
import { useAuthStore } from "../store/useAuthStore"; // import custom hook 'useAuthStore' to access authentication related states and functions

function ChatsList() { // create a functional component named 'ChatsList' to display list of chats
    const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
    // from custom hook 'useChatStore', extract 'getMyChatPartners' and 'setSelectedUser' functions and 'chats' and 'isUsersLoading' states
    
    const { onlineUsers } = useAuthStore(); // from custom hook 'useAuthStore', extract 'onlineUsers' state

    // run 'getMyChatPartners' function when 'getMyChatPartners' function changes as a side-effect

    useEffect(() => {
        getMyChatPartners();
    }, [getMyChatPartners]);

    if (isUsersLoading) return <UsersLoadingSkeleton />; // if 'isUsersLoading' state is true ie users are being loaded, display 'UsersLoadingSkeleton' component
    
    if (chats.length === 0) return <NoChatsFound />; // if 'chats' state is empty ie no chats are found, display 'NoChatsFound' component

    return (
        <>
            {chats.map((chat) => ( // iterate over all chats as 'chat'
                <div
                    key={chat._id} // unique ID of chat works as unique identifier of it
                    className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
                    onClick={() => setSelectedUser(chat)} // clicking this chat will set 'seletedUser' to this chat
                >
                    <div className="flex items-center gap-3">
                        <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}> {/* apply styles based on whether unique ID of chat exists in 'onlineUsers' state */}
                            <div className="size-12 rounded-full">
                                <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} /> {/* render chat's profile pic, or it's full name if pic not available */}
                            </div>
                        </div>
                        <h4 className="text-slate-200 font-medium truncate">{chat.fullName}</h4> {/* render chat's full name */}
                    </div>
                </div>
            ))}
        </>
    );
}

export default ChatsList;