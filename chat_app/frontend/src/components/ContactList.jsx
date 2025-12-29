import { useEffect } from "react"; // import useEffect hook to run side effects during component lifecycle
import { useChatStore } from "../store/useChatStore"; // import chat store hook to access contacts data and actions
import UsersLoadingSkeleton from "./UsersLoadingSkeleton"; // import loading skeleton to display while contacts are loading
import { useAuthStore } from "../store/useAuthStore"; // import auth store hook to access online users state

function ContactList() { // define a functional component named 'ContactList' to render all available contacts
    const { getAllContacts, allContacts, setSelectedUser, isUsersLoading } = useChatStore(); // extract contacts data, loading state, and selection handler from chat store
    
    const { onlineUsers } = useAuthStore(); // extract list of online user ids to determine contact presence status

    useEffect(() => { // run side effect when component mounts
        getAllContacts(); // fetch all contacts available to the authenticated user
    }, [getAllContacts]); // re-run effect only if the fetch function reference changes

    if (isUsersLoading) return <UsersLoadingSkeleton />; // render loading skeleton while contacts data is being fetched

    return (
        <>
            {allContacts.map((contact) => ( // iterate over all contacts to render each contact entry
                <div
                    key={contact._id}
                    className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
                    onClick={() => setSelectedUser(contact)} // update selected user in store when a contact is clicked
                >
                    <div className="flex items-center gap-3">
                        <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}> {/* determine online or offline state based on presence list */}
                            <div className="size-12 rounded-full">
                            <img src={contact.profilePic || "/avatar.png"} /> {/* resolve profile image source or fall back to default avatar when no profile picture is available */}
                            </div>
                        </div>
                        
                        <h4 className="text-slate-200 font-medium">{contact.fullName}</h4>
                    </div>
                </div>
            ))}
        </>
    );
}

export default ContactList;