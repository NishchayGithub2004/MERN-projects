import { useChatStore } from "../store/useChatStore"; // import custom hook 'useChatStore' to get chats related states and actions

function ActiveTabSwitch() {
    const { activeTab, setActiveTab } = useChatStore(); // get 'activeTab' state and 'setActiveTab' function from custom hook 'useChatStore'

    return (
        <div className="tabs tabs-boxed bg-transparent p-2 m-2">
            <button
                onClick={() => setActiveTab("chats")} // clicking this button sets the value of 'activeTab' to 'chats' in the store
                className={`tab ${activeTab === "chats" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`}
                // apply styles depending on whether the value of 'activeTab' is 'chats' or not
            >
                Chats
            </button>

            <button
                onClick={() => setActiveTab("contacts")} // clicking this button sets the value of 'activeTab' to 'contacts' in the store
                className={`tab ${activeTab === "contacts" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`}
                // apply styles depending on whether the value of 'activeTab' is 'contacts' or not
            >
                Contacts
            </button>
        </div>
    );
}

export default ActiveTabSwitch;