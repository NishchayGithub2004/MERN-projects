import { useEffect } from "react"; // import 'useEffect' hook to run side-effects
import { useChatStore } from "../store/useChatStore"; // import custom hook 'useChatStore' to access chat related states and functions
import UsersLoadingSkeleton from "./UsersLoadingSkeleton"; // import 'UsersLoadingSkeleton' component to display loading skeleton while fetching users
import { useAuthStore } from "../store/useAuthStore"; // import custom hook 'useAuthStore' to access authentication related states and functions

function ContactList() { // create a functional component named 'ContactList' to display a list of contacts
    const { getAllContacts, allContacts, setSelectedUser, isUsersLoading } = useChatStore();
    // from custom hook 'useChatStore' get 'getAllContacts' and 'setSelectedUser' functions and 'allContacts' and 'isUsersLoading' states
    
    const { onlineUsers } = useAuthStore(); // from custom hook 'useAuthStore' get 'onlineUsers' state

    // run 'getAllContacts' function when 'getAllContacts' function changes as a side-effect

    useEffect(() => {
        getAllContacts();
    }, [getAllContacts]);

    if (isUsersLoading) return <UsersLoadingSkeleton />; // if 'isUsersLoading' state is true ie users are being loaded, display 'UsersLoadingSkeleton' component

    return (
        <>
            {allContacts.map((contact) => ( // iterate over 'allContacts' array ie all contacts of user as 'contact'
                <div
                    key={contact._id} // contact's unique ID works as unique identifier of it
                    className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
                    onClick={() => setSelectedUser(contact)} // clicking this contact will set 'selectedUser' to this contact
                >
                    <div className="flex items-center gap-3">
                        <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}> {/* apply styles based on whether contact's unique ID exists in 'onlineUsers' array ie if this contact is currently online */}
                            <div className="size-12 rounded-full">
                                <img src={contact.profilePic || "/avatar.png"} /> {/* render this contact's profile pic, or fallback image if not available */}
                            </div>
                        </div>
                        <h4 className="text-slate-200 font-medium">{contact.fullName}</h4> {/* render this contact's full name */}
                    </div>
                </div>
            ))}
        </>
    );
}

export default ContactList;