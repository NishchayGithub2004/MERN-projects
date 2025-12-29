import { useEffect } from "react"; // import useEffect hook to run side effects during component lifecycle
import { useChatStore } from "../store/useChatStore"; // import chat store hook to access chat data and actions
import UsersLoadingSkeleton from "./UsersLoadingSkeleton"; // import loading skeleton to display while users list is loading
import NoChatsFound from "./NoChatsFound"; // import placeholder component to show when no chats are available
import { useAuthStore } from "../store/useAuthStore"; // import auth store hook to access authentication-related state

function ChatsList() { // define a functional component named 'ChatsList' to display the user's chat partners
    const { 
        getMyChatPartners, // extract function to fetch the current user's chat partners from backend or store
        chats, // extract array containing chat partner data
        isUsersLoading, // extract loading flag to determine whether users are still being fetched
        setSelectedUser // extract function to set the currently selected chat user
    } = useChatStore();
    
    const { onlineUsers } = useAuthStore(); // extract list of online user ids to determine user presence status

    useEffect(() => { // run side effect when the component mounts
        getMyChatPartners(); // fetch chat partners for the authenticated user
    }, [getMyChatPartners]); // re-run effect only if the fetch function reference changes

    if (isUsersLoading) return <UsersLoadingSkeleton />; // render loading skeleton while users data is being fetched
    
    if (chats.length === 0) return <NoChatsFound />; // render empty-state component when no chats are found

    return (
        <>
            {chats.map((chat) => ( /* iterate over chats array to render each chat partner entry */
                <div
                    key={chat._id} /* provide unique key to help React optimize list rendering */
                    className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
                    onClick={() => setSelectedUser(chat)} /* update selected user in store when a chat item is clicked */
                >
                    <div className="flex items-center gap-3">
                        <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}> {/* dynamically mark user as online or offline based on presence list */}
                            <div className="size-12 rounded-full">
                                <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} /> {/* fallback to default avatar if profile picture is missing */}
                            </div>
                        </div>
                        
                        <h4 className="text-slate-200 font-medium truncate">{chat.fullName}</h4> {/* render chat partner's name */}
                    </div>
                </div>
            ))}
        </>
    );
}

export default ChatsList;